package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "five_elements_balances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FiveElementsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saju_record_id", nullable = false)
    private SajuRecordEntity sajuRecord;

    @Column(name = "wood_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal woodRatio;

    @Column(name = "fire_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal fireRatio;

    @Column(name = "earth_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal earthRatio;

    @Column(name = "metal_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal metalRatio;

    @Column(name = "water_ratio", nullable = false, precision = 5, scale = 2)
    private BigDecimal waterRatio;

    @Column(name = "dominant_element", nullable = false, length = 20)
    private String dominantElement;

    @Column(name = "deficient_element", nullable = false, length = 20)
    private String deficientElement;

    @Column(name = "strength_status", nullable = false, length = 30)
    private String strengthStatus;

    @Column(name = "yongsin", nullable = false, length = 30)
    private String yongsin;

    @Column(name = "analysis_text", columnDefinition = "TEXT")
    private String analysisText;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
