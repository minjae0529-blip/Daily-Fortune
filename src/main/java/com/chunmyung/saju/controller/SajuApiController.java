package com.chunmyung.saju.controller;

import com.chunmyung.saju.dto.*;
import com.chunmyung.saju.security.SecurityUtils;
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
@Tag(name = "소원재 사주 & 운세 DB API", description = "사주, 일일 운세, 궁합, 타로 데이터베이스 저장 및 조회 API")
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
        SecurityUtils.validateNoSqlInjection(req.getName(), req.getGender(), req.getBirthType());
        Long sajuId = sajuService.saveSajuRecord(req);
        return ResponseEntity.ok(ApiResponseDto.ok(sajuId, "사주 분석 결과가 MySQL 데이터베이스에 성공적으로 저장되었습니다. (ID: " + sajuId + ")"));
    }

    @Operation(summary = "오늘의 운세 DB 저장", description = "오늘의 일일 운세 점수와 행운 요소를 DB에 저장합니다.")
    @PostMapping("/fortune/save")
    public ResponseEntity<ApiResponseDto<Long>> saveFortune(@RequestBody DailyFortuneSaveRequestDto req) {
        SecurityUtils.validateNoSqlInjection(req.getName(), req.getGender());
        Long fortuneId = sajuService.saveDailyFortune(req);
        return ResponseEntity.ok(ApiResponseDto.ok(fortuneId, "오늘의 운세가 MySQL 데이터베이스에 성공적으로 저장되었습니다."));
    }

    @Operation(summary = "궁합 분석 DB 저장", description = "두 사람의 사주 궁합 분석 점수 및 조언을 DB에 저장합니다.")
    @PostMapping("/compatibility/save")
    public ResponseEntity<ApiResponseDto<Long>> saveCompatibility(@RequestBody CompatibilitySaveRequestDto req) {
        SecurityUtils.validateNoSqlInjection(req.getUser1Name(), req.getUser2Name());
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

    @Operation(summary = "유료 사주 500원 간편결제 승인 (토스페이/카카오페이/네이버페이)", description = "사주 심층 리포트 500원 결제를 승인하고 MySQL payments 테이블에 저장합니다.")
    @PostMapping("/payment/checkout")
    public ResponseEntity<ApiResponseDto<PaymentResponseDto>> checkoutPayment(@RequestBody PaymentRequestDto req) {
        PaymentResponseDto res = sajuService.processPayment(req);
        return ResponseEntity.ok(ApiResponseDto.ok(res,
                res.getPaymentMethodKr() + " " + res.getAmount() + "원 결제가 완료되었습니다. (주문번호: " + res.getMerchantUid() + ")"));
    }

    @Operation(summary = "사용자 사주 리포트 결제 여부 조회", description = "사용자의 이름과 생년월일로 이미 500원 결제를 완료한 이력이 있는지 확인합니다.")
    @GetMapping("/payment/status")
    public ResponseEntity<ApiResponseDto<PaymentResponseDto>> checkPaymentStatus(
            @RequestParam String name,
            @RequestParam Integer birthYear,
            @RequestParam Integer birthMonth,
            @RequestParam Integer birthDay) {
        PaymentResponseDto paid = sajuService.getLatestPaidPayment(name, birthYear, birthMonth, birthDay);
        if (paid != null) {
            return ResponseEntity.ok(ApiResponseDto.ok(paid, "이미 결제 완료된 사주 리포트입니다."));
        } else {
            return ResponseEntity.ok(ApiResponseDto.ok(null, "결제 내역이 없습니다."));
        }
    }

    @Operation(summary = "최근 500원 간편결제 내역 조회 (JDBC 쿼리)", description = "MySQL payments 테이블에서 최근 결제 완료된 내역을 조회합니다.")
    @GetMapping("/payment/history")
    public ResponseEntity<ApiResponseDto<List<Map<String, Object>>>> getPaymentHistory(
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> list = sajuService.getRecentPaymentHistoryViaJdbc(limit);
        return ResponseEntity.ok(ApiResponseDto.ok(list, "최근 결제 내역 " + list.size() + "건을 조회했습니다."));
    }
}
