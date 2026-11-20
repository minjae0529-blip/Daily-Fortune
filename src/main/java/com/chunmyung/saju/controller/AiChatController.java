package com.chunmyung.saju.controller;

import com.chunmyung.saju.dto.AiChatDtos.*;
import com.chunmyung.saju.dto.ApiResponseDto;
import com.chunmyung.saju.entity.AiChatLogEntity;
import com.chunmyung.saju.service.AiCounselorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "천명 AI 명리 도사 챗봇 API", description = "사용자 사주 원국 및 일진 컨텍스트 연동 내장형 AI 상담 챗봇 API")
public class AiChatController {

    private final AiCounselorService aiCounselorService;

    @Operation(summary = "AI 명리 도사 1:1 질문 및 상담", description = "사용자의 질문과 사주/운세 컨텍스트를 분석하여 맞춤형 명리 상담 답변을 생성하고 MySQL에 저장합니다.")
    @PostMapping("/chat")
    public ResponseEntity<ApiResponseDto<ChatResponse>> chat(@RequestBody ChatRequest req) {
        try {
            ChatResponse res = aiCounselorService.generateCounselReply(req);
            return ResponseEntity.ok(ApiResponseDto.ok(res, "AI 명리 도사 응답이 생성되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponseDto.fail(e.getMessage()));
        }
    }

    @Operation(summary = "최근 AI 챗봇 상담 로그 조회", description = "MySQL ai_chat_logs 테이블에 저장된 최근 상담 내역을 조회합니다.")
    @GetMapping("/history")
    public ResponseEntity<ApiResponseDto<List<AiChatLogEntity>>> history() {
        return ResponseEntity.ok(ApiResponseDto.ok(aiCounselorService.getRecentChatLogs(), "최근 AI 상담 로그를 조회했습니다."));
    }
}
