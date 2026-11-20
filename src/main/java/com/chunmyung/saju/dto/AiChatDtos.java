package com.chunmyung.saju.dto;

import lombok.*;

public class AiChatDtos {

    @Data
    public static class ChatRequest {
        private String message;
        private String userName;
        private String gender;
        private String iljuName;
        private String dayMaster;
        private String zodiacAnimal;
        private String strengthStatus;
        private String yongsin;
        private String deficientElement;
        private String todayTenGod;
        private String todayTwelveStage;
        private Integer todayScore;
        private String luckyColor;
        private String luckyFood;
        private String luckyDirection;
        private String sinsalNames;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatResponse {
        private Long chatLogId;
        private String intentCategory;
        private String intentBadge;
        private String reply;
        private String followUpTip;
    }
}
