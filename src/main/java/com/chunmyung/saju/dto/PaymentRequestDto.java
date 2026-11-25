package com.chunmyung.saju.dto;

import lombok.Data;

@Data
public class PaymentRequestDto {
    private String name;
    private String gender;
    private Integer birthYear;
    private Integer birthMonth;
    private Integer birthDay;
    private Long sajuRecordId;
    private String productType;   // 'SAJU_FULL_REPORT'
    private String productName;   // '소원재(所願齋) 정통 사주팔자 · 대운 · 심층 리포트'
    private String paymentMethod; // 'TOSS_PAY', 'KAKAO_PAY', 'NAVER_PAY'
    private Integer amount;       // 500
}
