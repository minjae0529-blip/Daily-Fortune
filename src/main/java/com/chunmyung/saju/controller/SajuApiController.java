package com.chunmyung.saju.controller;

import com.chunmyung.saju.dto.*;
import com.chunmyung.saju.service.SajuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "천명 사주 & 운세 DB API", description = "사주, 일일 운세, 궁합, 타로 데이터베이스 저장 및 조회 API")
public class SajuApiController {

    private final SajuService sajuService;

    @Operation(summary = "JDBC 연결 진단", description = "MySQL과의 JDBC 연결 상태를 테스트합니다.")
    @GetMapping("/jdbc/check")
    public ResponseEntity<ApiResponseDto<Boolean>> checkJdbc() {
        boolean connected = sajuService.testJdbcConnection();
        if (connected) {
            return ResponseEntity.ok(ApiResponseDto.ok(true, "MySQL JDBC 연결이 정상입니다."));
        } else {
            return ResponseEntity.status(500).body(ApiResponseDto.fail("MySQL JDBC 연결에 실패했습니다."));
        }
    }

    @Operation(summary = "사주팔자 분석 결과 DB 저장", description = "사용자 정보와 함께 4주 8자, 오행 비율, 신살 내역을 DB에 저장합니다.")
    @PostMapping("/saju/save")
    public ResponseEntity<ApiResponseDto<Long>> saveSaju(@RequestBody SajuSaveRequestDto req) {
        Long sajuId = sajuService.saveSajuRecord(req);
        return ResponseEntity.ok(ApiResponseDto.ok(sajuId, "사주 분석 결과가 MySQL 데이터베이스에 성공적으로 저장되었습니다. (ID: " + sajuId + ")"));
    }

    @Operation(summary = "오늘의 운세 DB 저장", description = "오늘의 일일 운세 점수와 행운 요소를 DB에 저장합니다.")
    @PostMapping("/fortune/save")
    public ResponseEntity<ApiResponseDto<Long>> saveFortune(@RequestBody DailyFortuneSaveRequestDto req) {
        Long fortuneId = sajuService.saveDailyFortune(req);
        return ResponseEntity.ok(ApiResponseDto.ok(fortuneId, "오늘의 운세가 MySQL 데이터베이스에 성공적으로 저장되었습니다."));
    }

    @Operation(summary = "궁합 분석 DB 저장", description = "두 사람의 사주 궁합 분석 점수 및 조언을 DB에 저장합니다.")
    @PostMapping("/compatibility/save")
    public ResponseEntity<ApiResponseDto<Long>> saveCompatibility(@RequestBody CompatibilitySaveRequestDto req) {
        Long compatId = sajuService.saveCompatibility(req);
        return ResponseEntity.ok(ApiResponseDto.ok(compatId, "궁합 분석 결과가 MySQL 데이터베이스에 성공적으로 저장되었습니다."));
    }

    @Operation(summary = "타로 카드 점괘 DB 저장", description = "뽑은 타로 카드와 해석 조언을 DB에 저장합니다.")
    @PostMapping("/tarot/save")
    public ResponseEntity<ApiResponseDto<Long>> saveTarot(@RequestBody TarotSaveRequestDto req) {
        Long tarotId = sajuService.saveTarotReading(req);
        return ResponseEntity.ok(ApiResponseDto.ok(tarotId, "타로 카드 점괘가 MySQL 데이터베이스에 성공적으로 저장되었습니다."));
    }

    @Operation(summary = "최근 사주 기록 조회 (JDBC 쿼리)", description = "Spring JDBC / JdbcTemplate을 통해 최근 저장된 사주 기록을 조회합니다.")
    @GetMapping("/history/recent")
    public ResponseEntity<ApiResponseDto<List<Map<String, Object>>>> getRecentHistory(
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> list = sajuService.getRecentSajuListViaJdbc(limit);
        return ResponseEntity.ok(ApiResponseDto.ok(list, "최근 " + list.size() + "건의 기록을 조회했습니다."));
    }
}
