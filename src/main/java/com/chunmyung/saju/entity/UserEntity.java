package com.chunmyung.saju.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 10)
    private String gender; // 'M' or 'F'

    @Column(name = "birth_type", nullable = false, length = 20)
    private String birthType; // 'SOLAR', 'LUNAR', 'LEAP_LUNAR'

    @Column(name = "birth_year", nullable = false)
    private Integer birthYear;

    @Column(name = "birth_month", nullable = false)
    private Integer birthMonth;

    @Column(name = "birth_day", nullable = false)
    private Integer birthDay;

    @Column(name = "birth_hour")
    private Integer birthHour;

    @Column(name = "birth_minute")
    private Integer birthMinute;

    @Column(name = "is_time_unknown", nullable = false)
    private Boolean isTimeUnknown;

    @Column(name = "time_correction_applied", nullable = false)
    private Boolean timeCorrectionApplied;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        if (this.isTimeUnknown == null) {
            this.isTimeUnknown = false;
        }
        if (this.timeCorrectionApplied == null) {
            this.timeCorrectionApplied = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
