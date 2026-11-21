package com.chunmyung.saju.dto;

import lombok.*;

public class AuthDtos {

    @Data
    public static class SignupRequest {
        private String loginId;
        private String password;
        private String name;
        private String phoneNumber;
        private String gender;
        private Integer birthYear;
        private Integer birthMonth;
        private Integer birthDay;
    }

    @Data
    public static class LoginRequest {
        private String loginId;
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthStatusResponse {
        private boolean authenticated;
        private Long accountId;
        private String loginId;
        private String name;
        private String maskedPhone;
        private String gender;
        private Integer birthYear;
        private Integer birthMonth;
        private Integer birthDay;
        private String role;          // ROLE_USER, ROLE_ADMIN
        private int failedAttempts;
        private String accountStatus; // ACTIVE, WARNING_SMS_SENT, DORMANT_LOCKED
        private boolean smsSent;
        private String smsPreviewMessage;
        private String demoSmsCode;   // 웹 화면 휴대폰 SMS 수신 알림 시뮬레이션용 인증번호
    }

    @Data
    public static class SmsSendRequest {
        private String loginId;
        private String phoneNumber;
    }

    @Data
    public static class SmsUnlockRequest {
        private String loginId;
        private String phoneNumber;
        private String verificationCode;
        private String newPassword; // 선택적 비밀번호 재설정
    }
}
