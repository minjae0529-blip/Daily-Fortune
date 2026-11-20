package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tarot_readings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TarotEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "card_number", nullable = false)
    private Integer cardNumber;

    @Column(name = "card_name_kr", nullable = false, length = 50)
    private String cardNameKr;

    @Column(name = "card_name_en", nullable = false, length = 50)
    private String cardNameEn;

    @Column(name = "is_reversed", nullable = false)
    private Boolean isReversed;

    @Column(nullable = false, length = 100)
    private String keyword;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String interpretation;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String advice;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isReversed == null) {
            this.isReversed = false;
        }
    }
}
