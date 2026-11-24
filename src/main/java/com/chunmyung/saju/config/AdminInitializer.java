package com.chunmyung.saju.config;

import com.chunmyung.saju.entity.AccountEntity;
import com.chunmyung.saju.repository.AccountRepository;
import com.chunmyung.saju.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 시스템 구동 시 최고 관리자(ADMIN) 기본 계정을 안전하게 초기화 및 점검하는 컴포넌트
 * - 관리자 아이디 및 비밀번호는 환경변수(ADMIN_ID, ADMIN_PASSWORD)로 주입 가능
 * - 비밀번호는 PBKDF2WithHmacSHA256 (65,536회 반복 + 16바이트 Salt) 단방향 암호화 해싱 적용
 * - 보안 강화를 위해 로그 및 클라이언트에 평문 비밀번호 노출 차단
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    @Value("${chunmyung.security.admin-id:}")
    private String adminId;

    @Value("${chunmyung.security.admin-password:}")
    private String adminPassword;

    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (adminId == null || adminId.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            log.warn("⚠️ [보안 안내] ADMIN_ID 또는 ADMIN_PASSWORD 환경변수가 설정되지 않아 관리자 계정 자동 초기화를 건너뜁니다.");
            return;
        }
        final String targetAdminId = adminId.trim();
        final String targetAdminPw = adminPassword;

        accountRepository.findByLoginId(targetAdminId).ifPresentOrElse(admin -> {
            boolean updated = false;
            if (!"ROLE_ADMIN".equals(admin.getRole())) {
                admin.setRole("ROLE_ADMIN");
                updated = true;
            }
            if ("DORMANT_LOCKED".equals(admin.getAccountStatus())) {
                admin.setAccountStatus("ACTIVE");
                admin.setFailedAttempts(0);
                updated = true;
            }
            if (updated) {
                accountRepository.save(admin);
                log.info("🛡️ [관리자 계정 상태 갱신] 아이디: {}, 권한: ROLE_ADMIN", targetAdminId);
            } else {
                log.info("🛡️ [관리자 계정 확인] 아이디: {}, 권한: ROLE_ADMIN 정상 가동 중", targetAdminId);
            }
        }, () -> {
            String salt = SecurityUtils.generateSalt();
            String passwordHash = SecurityUtils.hashPassword(targetAdminPw, salt);

            AccountEntity admin = AccountEntity.builder()
                    .loginId(targetAdminId)
                    .passwordHash(passwordHash)
                    .passwordSalt(salt)
                    .name("천명 최고관리자")
                    .phoneNumber("010-0000-0000")
                    .gender("M")
                    .birthYear(1990)
                    .birthMonth(1)
                    .birthDay(1)
                    .role("ROLE_ADMIN")
                    .failedAttempts(0)
                    .accountStatus("ACTIVE")
                    .createdAt(LocalDateTime.now())
                    .build();

            accountRepository.save(admin);
            log.info("==================================================================");
            log.info("👑 [천명(天命) 시스템 최고 관리자 계정 초기화 완료]");
            log.info("👉 관리자 아이디   : {}", targetAdminId);
            log.info("👉 관리자 비밀번호 : [보안 처리됨 - 환경변수 ADMIN_PASSWORD로 안전하게 변경 가능]");
            log.info("👉 관리자 권한     : ROLE_ADMIN");
            log.info("👉 암호화 알고리즘 : PBKDF2WithHmacSHA256 (65,536 iters + 16B Salt)");
            log.info("==================================================================");
        });
    }
}
