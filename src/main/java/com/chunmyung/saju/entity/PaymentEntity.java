package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saju_record_id")
    private SajuRecordEntity sajuRecord;

    @Column(name = "merchant_uid", nullable = false, unique = true, length = 60)
    private String merchantUid;

    @Column(name = "product_type", nullable = false, length = 40)
    private String productType; // 'SAJU_FULL_REPORT', 'COMPATIBILITY_REPORT', 'TAROT_DEEP_REPORT'

    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @Column(name = "payment_method", nullable = false, length = 20)
    private String paymentMethod; // 'TOSS_PAY', 'KAKAO_PAY', 'NAVER_PAY'

    @Column(nullable = false)
    private Integer amount; // 500

    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus; // 'PAID', 'CANCELLED'

    @Column(name = "pg_tid", nullable = false, length = 80)
    private String pgTid;

    @Column(name = "paid_at", nullable = false, updatable = false)
    private LocalDateTime paidAt;

    @PrePersist
    public void prePersist() {
        if (this.paidAt == null) {
            this.paidAt = LocalDateTime.now();
        }
        if (this.amount == null) {
            this.amount = 500;
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = "PAID";
        }
        if (this.productType == null) {
            this.productType = "SAJU_FULL_REPORT";
        }
    }
}
