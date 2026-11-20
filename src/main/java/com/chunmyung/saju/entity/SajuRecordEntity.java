package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "saju_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SajuRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "year_cheongan", nullable = false, length = 10)
    private String yearCheongan;

    @Column(name = "year_jiji", nullable = false, length = 10)
    private String yearJiji;

    @Column(name = "month_cheongan", nullable = false, length = 10)
    private String monthCheongan;

    @Column(name = "month_jiji", nullable = false, length = 10)
    private String monthJiji;

    @Column(name = "day_cheongan", nullable = false, length = 10)
    private String dayCheongan;

    @Column(name = "day_jiji", nullable = false, length = 10)
    private String dayJiji;

    @Column(name = "time_cheongan", length = 10)
    private String timeCheongan;

    @Column(name = "time_jiji", length = 10)
    private String timeJiji;

    @Column(name = "day_master", nullable = false, length = 10)
    private String dayMaster;

    @Column(name = "ilju_name", nullable = false, length = 20)
    private String iljuName;

    @Column(name = "zodiac_animal", nullable = false, length = 20)
    private String zodiacAnimal;

    @Column(name = "ilju_description", columnDefinition = "TEXT")
    private String iljuDescription;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "sajuRecord", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private FiveElementsEntity fiveElements;

    @OneToMany(mappedBy = "sajuRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SinsalEntity> sinsals = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
