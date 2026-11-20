package com.chunmyung.saju.dto;

import lombok.Data;

@Data
public class CompatibilitySaveRequestDto {
    private String user1Name;
    private String user1Gender;
    private Integer user1BirthYear;
    private Integer user1BirthMonth;
    private Integer user1BirthDay;

    private String user2Name;
    private String user2Gender;
    private Integer user2BirthYear;
    private Integer user2BirthMonth;
    private Integer user2BirthDay;

    private Integer score;
    private String grade;
    private String cheonganHarmony;
    private String jijiHarmony;
    private String relationshipAdvice;
}
