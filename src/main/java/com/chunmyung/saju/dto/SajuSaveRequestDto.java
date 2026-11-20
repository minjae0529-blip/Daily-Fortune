package com.chunmyung.saju.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class SajuSaveRequestDto {
    // 사용자 정보
    private String name;
    private String gender; // M, F
    private String birthType; // SOLAR, LUNAR, LEAP_LUNAR
    private Integer birthYear;
    private Integer birthMonth;
    private Integer birthDay;
    private Integer birthHour;
    private Integer birthMinute;
    private Boolean isTimeUnknown;
    private Boolean timeCorrectionApplied;

    // 4주 8자
    private String yearCheongan;
    private String yearJiji;
    private String monthCheongan;
    private String monthJiji;
    private String dayCheongan;
    private String dayJiji;
    private String timeCheongan;
    private String timeJiji;
    private String dayMaster;
    private String iljuName;
    private String zodiacAnimal;
    private String iljuDescription;

    // 오행 분석
    private BigDecimal woodRatio;
    private BigDecimal fireRatio;
    private BigDecimal earthRatio;
    private BigDecimal metalRatio;
    private BigDecimal waterRatio;
    private String dominantElement;
    private String deficientElement;
    private String strengthStatus;
    private String yongsin;
    private String analysisText;

    // 신살 목록
    private List<SinsalDto> sinsals;

    @Data
    public static class SinsalDto {
        private String pillarType;
        private String sinsalName;
        private String sinsalType;
        private String description;
    }
}
