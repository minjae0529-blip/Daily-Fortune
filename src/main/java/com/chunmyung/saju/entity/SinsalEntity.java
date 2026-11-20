package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sinsal_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SinsalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saju_record_id", nullable = false)
    private SajuRecordEntity sajuRecord;

    @Column(name = "pillar_type", nullable = false, length = 20)
    private String pillarType; // 'YEAR', 'MONTH', 'DAY', 'TIME', 'GENERAL'

    @Column(name = "sinsal_name", nullable = false, length = 50)
    private String sinsalName;

    @Column(name = "sinsal_type", nullable = false, length = 20)
    private String sinsalType; // 'AUSPICIOUS', 'INAUSPICIOUS', 'NEUTRAL'

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.sinsalType == null) {
            this.sinsalType = "NEUTRAL";
        }
    }
}
