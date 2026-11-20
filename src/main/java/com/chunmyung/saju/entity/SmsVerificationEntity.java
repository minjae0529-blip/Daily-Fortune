package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sms_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmsVerificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login_id", nullable = false, length = 40)
    private String loginId;

    @Column(name = "phone_number", nullable = false, length = 25)
    private String phoneNumber;

    @Column(name = "verification_code", nullable = false, length = 10)
    private String verificationCode;

    @Column(nullable = false, length = 30)
    private String purpose; // 'FAILED_5_ALERT', 'DORMANT_UNLOCK'

    @Column(name = "message_content", nullable = false, length = 255)
    private String messageContent;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.expiresAt == null) {
            this.expiresAt = LocalDateTime.now().plusMinutes(5);
        }
        if (this.isVerified == null) {
            this.isVerified = false;
        }
    }
}
