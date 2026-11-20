package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_fortunes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyFortuneEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "fortune_date", nullable = false)
    private LocalDate fortuneDate;

    @Column(name = "today_gapja", nullable = false, length = 20)
    private String todayGapja;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Column(name = "wealth_score", nullable = false)
    private Integer wealthScore;

    @Column(name = "love_score", nullable = false)
    private Integer loveScore;

    @Column(name = "career_score", nullable = false)
    private Integer careerScore;

    @Column(name = "health_score", nullable = false)
    private Integer healthScore;

    @Column(name = "lucky_color", nullable = false, length = 30)
    private String luckyColor;

    @Column(name = "lucky_number", nullable = false, length = 20)
    private String luckyNumber;

    @Column(name = "lucky_direction", nullable = false, length = 30)
    private String luckyDirection;

    @Column(name = "overall_advice", nullable = false, columnDefinition = "TEXT")
    private String overallAdvice;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.fortuneDate == null) {
            this.fortuneDate = LocalDate.now();
        }
    }
}
