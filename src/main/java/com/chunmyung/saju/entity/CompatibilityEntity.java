package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "compatibility_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompatibilityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private UserEntity user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private UserEntity user2;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false, length = 30)
    private String grade;

    @Column(name = "cheongan_harmony", columnDefinition = "TEXT")
    private String cheonganHarmony;

    @Column(name = "jiji_harmony", columnDefinition = "TEXT")
    private String jijiHarmony;

    @Column(name = "relationship_advice", nullable = false, columnDefinition = "TEXT")
    private String relationshipAdvice;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
