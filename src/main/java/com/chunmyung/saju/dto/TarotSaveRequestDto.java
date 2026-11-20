package com.chunmyung.saju.dto;

import lombok.Data;

@Data
public class TarotSaveRequestDto {
    private Long userId;
    private Integer cardNumber;
    private String cardNameKr;
    private String cardNameEn;
    private Boolean isReversed;
    private String keyword;
    private String interpretation;
    private String advice;
}
