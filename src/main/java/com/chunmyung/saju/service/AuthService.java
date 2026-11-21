package com.chunmyung.saju.service;

import com.chunmyung.saju.dto.ApiResponseDto;
import com.chunmyung.saju.dto.AuthDtos.*;
import com.chunmyung.saju.entity.AccountEntity;
import com.chunmyung.saju.entity.SmsVerificationEntity;
import com.chunmyung.saju.repository.AccountRepository;
import com.chunmyung.saju.repository.SmsVerificationRepository;
import com.chunmyung.saju.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AccountRepository accountRepository;
    private final SmsVerificationRepository smsVerificationRepository;

    /**
     * 아이디 중복 체크 (SQL Injection 방어 포함)
     */
    public ApiResponseDto<Boolean> checkDuplicateId(String loginId) {
        SecurityUtils.validateNoSqlInjection(loginId);
        if (!SecurityUtils.isValidLoginId(loginId)) {
            return ApiResponseDto.fail("아이디는 영문, 숫자, 밑줄(_) 조합 4~20자로 입력해주세요.");
        }
        boolean exists = accountRepository.existsByLoginId(loginId.trim());
        if (exists) {
            return ApiResponseDto.fail("이미 사용 중인 아이디입니다.");
        }
        return ApiResponseDto.ok(true, "사용 가능한 아이디입니다.");
    }

    /**
     * 회원가입 (PBKDF2WithHmacSHA256 + 랜덤 Salt 암호화 및 SQL Injection / XSS 차단)
     */
    @Transactional
    public ApiResponseDto<AuthStatusResponse> registerAccount(SignupRequest req) {
        // 1. SQL 인젝션 공격 시그니처 검증
        SecurityUtils.validateNoSqlInjection(req.getLoginId(), req.getName(), req.getPhoneNumber(), req.getGender());

        String loginId = req.getLoginId() != null ? req.getLoginId().trim() : "";
        String rawPw = req.getPassword() != null ? req.getPassword() : "";
        String name = SecurityUtils.sanitizeXss(req.getName() != null ? req.getName().trim() : "");
        String phone = req.getPhoneNumber() != null ? req.getPhoneNumber().trim() : "";

        if (!SecurityUtils.isValidLoginId(loginId)) {
            return ApiResponseDto.fail("아이디는 영문, 숫자, 밑줄(_) 4~20자로 입력해야 합니다.");
        }
        if (rawPw.length() < 4) {
            return ApiResponseDto.fail("비밀번호는 최소 4자리 이상이어야 합니다.");
        }
        if (name.isBlank()) {
            return ApiResponseDto.fail("이름(닉네임)을 입력해주세요.");
        }
        if (!SecurityUtils.isValidPhone(phone)) {
            return ApiResponseDto.fail("유효한 휴대폰 번호(예: 010-1234-5678)를 입력해주세요.");
        }
        if (accountRepository.existsByLoginId(loginId)) {
            return ApiResponseDto.fail("이미 가입된 아이디입니다. 다른 아이디를 사용해주세요.");
        }

        // 2. PBKDF2WithHmacSHA256 + 16바이트 Salt 단방향 해싱
        String salt = SecurityUtils.generateSalt();
        String passwordHash = SecurityUtils.hashPassword(rawPw, salt);

        AccountEntity account = AccountEntity.builder()
                .loginId(loginId)
                .passwordHash(passwordHash)
                .passwordSalt(salt)
                .name(name)
                .phoneNumber(normalizePhone(phone))
                .gender(req.getGender() != null ? req.getGender() : "M")
                .birthYear(req.getBirthYear() != null ? req.getBirthYear() : 1996)
                .birthMonth(req.getBirthMonth() != null ? req.getBirthMonth() : 5)
                .birthDay(req.getBirthDay() != null ? req.getBirthDay() : 15)
                .failedAttempts(0)
                .role("ROLE_USER")
                .accountStatus("ACTIVE")
                .build();

        AccountEntity saved = accountRepository.save(account);
        log.info("==> [회원가입 완료] loginId={}, name={}, phone={}", saved.getLoginId(), saved.getName(), maskPhone(saved.getPhoneNumber()));

        return ApiResponseDto.ok(toStatusResponse(saved, true, false, null, null),
                saved.getName() + " 님, 천명(天命) 회원가입이 완료되었습니다!");
    }

    /**
     * 보안 로그인 처리:
     * - 1~4회 실패: 경고 메시지
     * - 5~9회 실패: 등록된 휴대폰으로 보안 경고 & 인증번호 문자(SMS) 자동 발송
     * - 10회 이상 실패: 계정 즉시 휴면화(DORMANT_LOCKED) 및 SMS 인증번호 해제 강제
     */
    @Transactional
    public ApiResponseDto<AuthStatusResponse> loginAccount(LoginRequest req) {
        // 1. SQL 인젝션 공격 시그니처 검증
        SecurityUtils.validateNoSqlInjection(req.getLoginId());

        String loginId = req.getLoginId() != null ? req.getLoginId().trim() : "";
        String rawPw = req.getPassword() != null ? req.getPassword() : "";

        Optional<AccountEntity> opt = accountRepository.findByLoginId(loginId);
        if (opt.isEmpty()) {
            return ApiResponseDto.fail("존재하지 않는 아이디입니다. 회원가입 후 이용해주세요.");
        }

        AccountEntity account = opt.get();

        // 2. 이미 10회 이상 틀려서 휴면(잠금)화된 계정인지 우선 확인
        if ("DORMANT_LOCKED".equals(account.getAccountStatus()) || account.getFailedAttempts() >= 10) {
            account.setAccountStatus("DORMANT_LOCKED");
            SmsVerificationEntity sms = createAndSendSms(account, "DORMANT_UNLOCK",
                    String.format("[천명(天命) 휴면계정 해제] 비밀번호 10회 이상 오류로 계정이 휴면 잠금 상태입니다. 본인확인 인증번호 [%s]를 입력해 휴면을 해제하세요.", "%s"));

            AuthStatusResponse status = toStatusResponse(account, false, true, sms.getMessageContent(), sms.getVerificationCode());
            return ApiResponseDto.<AuthStatusResponse>builder()
                    .success(false)
                    .message("🔒 비밀번호 10회 이상 오류로 계정이 휴면화(잠금)되었습니다. 휴대폰(" + maskPhone(account.getPhoneNumber()) + ")으로 발송된 인증번호로 휴면을 해제해주세요.")
                    .data(status)
                    .build();
        }

        // 3. 비밀번호 해시 검증
        boolean matched = SecurityUtils.verifyPassword(rawPw, account.getPasswordSalt(), account.getPasswordHash());
        if (matched) {
            // 로그인 성공 -> 실패 횟수 0으로 초기화 및 ACTIVE 복구
            account.setFailedAttempts(0);
            account.setAccountStatus("ACTIVE");
            account.setLastLoginAt(LocalDateTime.now());
            log.info("==> [로그인 성공] loginId={}", account.getLoginId());

            return ApiResponseDto.ok(
                    toStatusResponse(account, true, false, null, null),
                    account.getName() + " 님, 환영합니다!");
        }

        // 4. 비밀번호 불일치 -> 실패 횟수 증가 및 단계별 보안 조치
        int attempts = account.getFailedAttempts() + 1;
        account.setFailedAttempts(attempts);
        account.setLastFailedAt(LocalDateTime.now());

        // [단계 A] 10회 이상 실패: 계정 즉시 휴면화 (DORMANT_LOCKED) 및 해제용 SMS 발송
        if (attempts >= 10) {
            account.setAccountStatus("DORMANT_LOCKED");
            SmsVerificationEntity sms = createAndSendSms(account, "DORMANT_UNLOCK",
                    "[천명(天命) 긴급보안] 비밀번호 10회 연속 오류로 계정이 휴면화(잠금) 처리되었습니다. 해제 인증번호는 [%s] 입니다.");

            AuthStatusResponse status = toStatusResponse(account, false, true, sms.getMessageContent(), sms.getVerificationCode());
            return ApiResponseDto.<AuthStatusResponse>builder()
                    .success(false)
                    .message("🔒 비밀번호를 10회 이상 잘못 입력하여 계정이 휴면화(잠금)되었습니다! 휴대폰(" + maskPhone(account.getPhoneNumber()) + ")으로 발송된 SMS 인증번호를 입력해야 잠금이 해제됩니다.")
                    .data(status)
                    .build();
        }

        // [단계 B] 5회 이상 ~ 9회 실패: 휴대폰 번호로 보안 경고 & 인증 문자(SMS) 발송
        if (attempts >= 5) {
            account.setAccountStatus("WARNING_SMS_SENT");
            SmsVerificationEntity sms = createAndSendSms(account, "FAILED_5_ALERT",
                    "[천명(天命) 보안경고] 비밀번호 " + attempts + "회 연속 오류 감지! 본인확인 인증번호는 [%s] 입니다. (10회 오류 시 계정 휴면화)");

            AuthStatusResponse status = toStatusResponse(account, false, true, sms.getMessageContent(), sms.getVerificationCode());
            return ApiResponseDto.<AuthStatusResponse>builder()
                    .success(false)
                    .message("🚨 비밀번호 " + attempts + "회 연속 오류! 등록된 휴대폰(" + maskPhone(account.getPhoneNumber()) + ")으로 보안 경고 문자가 발송되었습니다. (10회 이상 실패 시 계정이 휴면화됩니다. 남은 기회: " + (10 - attempts) + "회)")
                    .data(status)
                    .build();
        }

        // [단계 C] 1~4회 실패 (5회 이하 경고)
        AuthStatusResponse status = toStatusResponse(account, false, false, null, null);
        return ApiResponseDto.<AuthStatusResponse>builder()
                .success(false)
                .message("⚠️ 비밀번호가 일치하지 않습니다. (현재 " + attempts + "회 실패 / 5회 이상 오류 시 휴대폰 문자 발송, 10회 이상 오류 시 계정 휴면화)")
                .data(status)
                .build();
    }

    /**
     * 휴면 해제 / 본인확인용 휴대폰 SMS 인증번호 수동 발송
     */
    @Transactional
    public ApiResponseDto<AuthStatusResponse> sendUnlockSms(SmsSendRequest req) {
        SecurityUtils.validateNoSqlInjection(req.getLoginId(), req.getPhoneNumber());

        String loginId = req.getLoginId() != null ? req.getLoginId().trim() : "";
        String phone = normalizePhone(req.getPhoneNumber());

        Optional<AccountEntity> opt = accountRepository.findByLoginId(loginId);
        if (opt.isEmpty()) {
            return ApiResponseDto.fail("해당 아이디로 가입된 계정을 찾을 수 없습니다.");
        }

        AccountEntity account = opt.get();
        if (!account.getPhoneNumber().equals(phone)) {
            return ApiResponseDto.fail("가입 시 등록한 휴대폰 번호(" + maskPhone(account.getPhoneNumber()) + ")와 일치하지 않습니다.");
        }

        SmsVerificationEntity sms = createAndSendSms(account, "DORMANT_UNLOCK",
                "[천명(天命) 본인확인] 계정 휴면·잠금 해제 인증번호는 [%s] 입니다. 5분 이내에 입력해주세요.");

        AuthStatusResponse status = toStatusResponse(account, false, true, sms.getMessageContent(), sms.getVerificationCode());
        return ApiResponseDto.ok(status, "📱 휴대폰(" + maskPhone(account.getPhoneNumber()) + ")으로 6자리 인증번호 문자를 발송했습니다.");
    }

    /**
     * 휴대폰 SMS 인증번호 검증을 통한 계정 휴면(잠금) 해제 및 실패 횟수 초기화
     */
    @Transactional
    public ApiResponseDto<AuthStatusResponse> unlockAccountWithSms(SmsUnlockRequest req) {
        SecurityUtils.validateNoSqlInjection(req.getLoginId(), req.getPhoneNumber(), req.getVerificationCode());

        String loginId = req.getLoginId() != null ? req.getLoginId().trim() : "";
        String phone = normalizePhone(req.getPhoneNumber());
        String code = req.getVerificationCode() != null ? req.getVerificationCode().trim() : "";

        Optional<AccountEntity> opt = accountRepository.findByLoginId(loginId);
        if (opt.isEmpty()) {
            return ApiResponseDto.fail("존재하지 않는 아이디입니다.");
        }
        AccountEntity account = opt.get();

        if (!account.getPhoneNumber().equals(phone)) {
            return ApiResponseDto.fail("등록된 휴대폰 번호와 일치하지 않습니다.");
        }

        Optional<SmsVerificationEntity> smsOpt = smsVerificationRepository
                .findFirstByLoginIdAndIsVerifiedFalseOrderByCreatedAtDesc(loginId);

        if (smsOpt.isEmpty()) {
            return ApiResponseDto.fail("발송된 인증번호 내역이 없습니다. [인증번호 문자 재발송]을 먼저 눌러주세요.");
        }

        SmsVerificationEntity sms = smsOpt.get();
        if (sms.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ApiResponseDto.fail("인증번호 유효시간(5분)이 만료되었습니다. 인증번호를 다시 발송해주세요.");
        }

        if (!sms.getVerificationCode().equals(code)) {
            return ApiResponseDto.fail("인증번호 6자리가 일치하지 않습니다. 발송된 문자 메시지를 다시 확인해주세요.");
        }

        // 인증 성공! -> SMS 인증 완료 처리 + 계정 휴면 해제 + 실패 횟수 0 초기화
        sms.setIsVerified(true);
        account.setFailedAttempts(0);
        account.setAccountStatus("ACTIVE");

        // 새 비밀번호가 함께 입력된 경우 비밀번호도 안전하게 변경
        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            if (req.getNewPassword().length() < 4) {
                return ApiResponseDto.fail("새 비밀번호는 최소 4자리 이상이어야 합니다.");
            }
            String newSalt = SecurityUtils.generateSalt();
            String newHash = SecurityUtils.hashPassword(req.getNewPassword(), newSalt);
            account.setPasswordSalt(newSalt);
            account.setPasswordHash(newHash);
        }

        log.info("==> [SMS 인증 및 휴면 해제 완료] loginId={}", account.getLoginId());
        AuthStatusResponse status = toStatusResponse(account, false, false, null, null);
        return ApiResponseDto.ok(status, "✅ 휴대폰 SMS 인증이 완료되어 계정 휴면(잠금) 및 오류 횟수가 모두 초기화되었습니다! 이제 로그인하실 수 있습니다.");
    }

    public Optional<AccountEntity> findById(Long accountId) {
        return accountRepository.findById(accountId);
    }

    public AuthStatusResponse toStatusResponse(AccountEntity account, boolean authenticated,
                                               boolean smsSent, String smsMsg, String demoCode) {
        return AuthStatusResponse.builder()
                .authenticated(authenticated)
                .accountId(account.getId())
                .loginId(account.getLoginId())
                .name(account.getName())
                .maskedPhone(maskPhone(account.getPhoneNumber()))
                .gender(account.getGender())
                .birthYear(account.getBirthYear())
                .birthMonth(account.getBirthMonth())
                .birthDay(account.getBirthDay())
                .role(account.getRole() != null ? account.getRole() : "ROLE_USER")
                .failedAttempts(account.getFailedAttempts())
                .accountStatus(account.getAccountStatus())
                .smsSent(smsSent)
                .smsPreviewMessage(smsMsg)
                .demoSmsCode(demoCode)
                .build();
    }

    private SmsVerificationEntity createAndSendSms(AccountEntity account, String purpose, String template) {
        String code = SecurityUtils.generateSmsCode();
        String message = String.format(template, code);

        SmsVerificationEntity entity = SmsVerificationEntity.builder()
                .loginId(account.getLoginId())
                .phoneNumber(account.getPhoneNumber())
                .verificationCode(code)
                .purpose(purpose)
                .messageContent(message)
                .isVerified(false)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();

        SmsVerificationEntity saved = smsVerificationRepository.save(entity);
        log.warn("📱 [SMS 발송 완료 -> {}] {}", maskPhone(account.getPhoneNumber()), message);
        return saved;
    }

    private String normalizePhone(String phone) {
        if (phone == null) return "";
        return phone.replaceAll("[^0-9]", "");
    }

    private String maskPhone(String digits) {
        if (digits == null || digits.length() < 10) return "010-****-****";
        if (digits.length() == 11) {
            return digits.substring(0, 3) + "-****-" + digits.substring(7);
        }
        return digits.substring(0, 3) + "-***-" + digits.substring(6);
    }
}
