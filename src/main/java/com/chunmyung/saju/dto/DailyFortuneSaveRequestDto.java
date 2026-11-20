package com.chunmyung.saju.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DailyFortuneSaveRequestDto {
    private Long userId;
    private String name;
    private String gender;
    private Integer birthYear;
    private Integer birthMonth;
    private Integer birthDay;

    private LocalDate fortuneDate;
    private String todayGapja;
    private Integer totalScore;
    private Integer wealthScore;
    private Integer loveScore;
    private Integer careerScore;
    private Integer healthScore;
    private String luckyColor;
    private String luckyNumber;
    private String luckyDirection;
    private String overallAdvice;
}
