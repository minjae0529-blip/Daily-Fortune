package com.chunmyung.saju.config;

import com.chunmyung.saju.entity.AccountEntity;
import com.chunmyung.saju.repository.AccountRepository;
import com.chunmyung.saju.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 시스템 구동 시 최고 관리자(ADMIN) 기본 계정을 자동 생성 및 점검하는 초기화 컴포넌트
 * - 관리자 아이디: admin
 * - 관리자 비밀번호: admin1234! (PBKDF2WithHmacSHA256 단방향 해싱 + 고유 Salt)
 * - 권한: ROLE_ADMIN
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    public static final String DEFAULT_ADMIN_ID = "admin";
    public static final String DEFAULT_ADMIN_PASSWORD = "admin1234!";

    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        accountRepository.findByLoginId(DEFAULT_ADMIN_ID).ifPresentOrElse(admin -> {
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
                log.info("🛡️ [관리자 계정 갱신] 아이디: {}, 권한: ROLE_ADMIN", DEFAULT_ADMIN_ID);
            } else {
                log.info("🛡️ [관리자 계정 확인] 아이디: {}, 권한: ROLE_ADMIN 정상 가동 중", DEFAULT_ADMIN_ID);
            }
        }, () -> {
            String salt = SecurityUtils.generateSalt();
            String passwordHash = SecurityUtils.hashPassword(DEFAULT_ADMIN_PASSWORD, salt);

            AccountEntity admin = AccountEntity.builder()
                    .loginId(DEFAULT_ADMIN_ID)
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
            log.info("👑 [천명(天命) 최고 관리자 계정 생성 완료]");
            log.info("👉 관리자 아이디   : {}", DEFAULT_ADMIN_ID);
            log.info("👉 관리자 비밀번호 : {}", DEFAULT_ADMIN_PASSWORD);
            log.info("👉 관리자 이름     : 천명 최고관리자");
            log.info("👉 관리자 권한     : ROLE_ADMIN");
            log.info("👉 암호화 알고리즘 : PBKDF2WithHmacSHA256 (65,536 iters + 16B Salt)");
            log.info("==================================================================");
        });
    }
}
