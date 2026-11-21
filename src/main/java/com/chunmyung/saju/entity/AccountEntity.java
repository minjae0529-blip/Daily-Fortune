package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login_id", nullable = false, unique = true, length = 40)
    private String loginId;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "password_salt", nullable = false, length = 120)
    private String passwordSalt;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "phone_number", nullable = false, length = 25)
    private String phoneNumber;

    @Column(length = 10)
    private String gender; // 'M' or 'F'

    @Column(name = "birth_year")
    private Integer birthYear;

    @Column(name = "birth_month")
    private Integer birthMonth;

    @Column(name = "birth_day")
    private Integer birthDay;

    @Column(name = "failed_attempts", nullable = false)
    private Integer failedAttempts;

    /**
     * 계정 권한:
     * - ROLE_USER : 일반 회원
     * - ROLE_ADMIN : 시스템 최고 관리자
     */
    @Column(name = "role", nullable = false, length = 20)
    private String role;

    /**
     * 계정 상태:
     * - ACTIVE : 정상 활성 계정 (실패 0~4회)
     * - WARNING_SMS_SENT : 비밀번호 5~9회 오류로 휴대폰 보안 문자(SMS)가 발송된 경고 상태
     * - DORMANT_LOCKED : 비밀번호 10회 이상 오류로 계정이 휴면(잠금)화된 상태 (SMS 인증번호로만 해제 가능)
     */
    @Column(name = "account_status", nullable = false, length = 30)
    private String accountStatus;

    @Column(name = "last_failed_at")
    private LocalDateTime lastFailedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.failedAttempts == null) {
            this.failedAttempts = 0;
        }
        if (this.role == null) {
            this.role = "ROLE_USER";
        }
        if (this.accountStatus == null) {
            this.accountStatus = "ACTIVE";
        }
        if (this.gender == null) {
            this.gender = "M";
        }
    }
}
