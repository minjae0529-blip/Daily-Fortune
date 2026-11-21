package com.chunmyung.saju.controller;

import com.chunmyung.saju.dto.ApiResponseDto;
import com.chunmyung.saju.entity.AccountEntity;
import com.chunmyung.saju.repository.AccountRepository;
import com.chunmyung.saju.repository.AiChatLogRepository;
import com.chunmyung.saju.repository.PaymentRepository;
import com.chunmyung.saju.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "시스템 최고관리자 전용 API", description = "전체 회원 조회, 휴면 계정 강제 해제, 시스템 통합 통계 대시보드 API")
public class AdminApiController {

    private static final String SESSION_ACCOUNT_ID = "CHUNMYUNG_AUTH_ACCOUNT_ID";

    private final AccountRepository accountRepository;
    private final PaymentRepository paymentRepository;
    private final AiChatLogRepository aiChatLogRepository;
    private final AuthService authService;

    @Data
    @Builder
    public static class AdminStatsResponse {
        private long totalAccounts;
        private long activeAccounts;
        private long dormantAccounts;
        private long totalPayments;
        private long totalPaymentAmount;
        private long totalAiConsultations;
    }

    @Data
    @Builder
    public static class AccountSummaryDto {
        private Long id;
        private String loginId;
        private String name;
        private String phoneNumber;
        private String role;
        private int failedAttempts;
        private String accountStatus;
        private LocalDateTime lastLoginAt;
        private LocalDateTime createdAt;
    }

    /**
     * 관리자 권한(ROLE_ADMIN) 세션 검증 헬퍼
     */
    private Optional<AccountEntity> verifyAdmin(HttpSession session) {
        Object idObj = session.getAttribute(SESSION_ACCOUNT_ID);
        if (idObj instanceof Long accountId) {
            Optional<AccountEntity> opt = authService.findById(accountId);
            if (opt.isPresent() && "ROLE_ADMIN".equals(opt.get().getRole())) {
                return opt;
            }
        }
        return Optional.empty();
    }

    @Operation(summary = "관리자 시스템 통합 통계", description = "총 회원수, 휴면 계정수, 유료 결제 건수/총액, AI 상담 로그 집계를 반환합니다.")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponseDto<AdminStatsResponse>> getStats(HttpSession session) {
        if (verifyAdmin(session).isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseDto.fail("관리자 권한(ROLE_ADMIN)이 필요한 서비스입니다."));
        }

        List<AccountEntity> accounts = accountRepository.findAll();
        long totalAccounts = accounts.size();
        long dormant = accounts.stream().filter(a -> "DORMANT_LOCKED".equals(a.getAccountStatus())).count();
        long active = totalAccounts - dormant;

        long totalPayments = paymentRepository.count();
        long totalAmount = paymentRepository.findAll().stream()
                .mapToLong(p -> p.getAmount() != null ? p.getAmount() : 500)
                .sum();

        long totalAi = aiChatLogRepository.count();

        AdminStatsResponse stats = AdminStatsResponse.builder()
                .totalAccounts(totalAccounts)
                .activeAccounts(active)
                .dormantAccounts(dormant)
                .totalPayments(totalPayments)
                .totalPaymentAmount(totalAmount)
                .totalAiConsultations(totalAi)
                .build();

        return ResponseEntity.ok(ApiResponseDto.ok(stats, "관리자 통계 조회 성공"));
    }

    @Operation(summary = "전체 회원 계정 목록 조회", description = "전체 가입 계정 목록 및 상태를 조회합니다.")
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponseDto<List<AccountSummaryDto>>> listAccounts(HttpSession session) {
        if (verifyAdmin(session).isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseDto.fail("관리자 권한(ROLE_ADMIN)이 필요합니다."));
        }

        List<AccountSummaryDto> list = accountRepository.findAll().stream()
                .map(a -> AccountSummaryDto.builder()
                        .id(a.getId())
                        .loginId(a.getLoginId())
                        .name(a.getName())
                        .phoneNumber(a.getPhoneNumber())
                        .role(a.getRole() != null && !a.getRole().isBlank() ? a.getRole() : "ROLE_USER")
                        .failedAttempts(a.getFailedAttempts())
                        .accountStatus(a.getAccountStatus())
                        .lastLoginAt(a.getLastLoginAt())
                        .createdAt(a.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponseDto.ok(list, "회원 목록 조회 성공"));
    }

    @Operation(summary = "관리자 권한 계정 잠금/휴면 해제", description = "비밀번호 실패로 잠긴 계정을 관리자 권한으로 즉시 정상화(ACTIVE)합니다.")
    @PostMapping("/accounts/{id}/unlock")
    @Transactional
    public ResponseEntity<ApiResponseDto<Void>> unlockAccount(@PathVariable Long id, HttpSession session) {
        if (verifyAdmin(session).isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseDto.fail("관리자 권한(ROLE_ADMIN)이 필요합니다."));
        }

        Optional<AccountEntity> opt = accountRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponseDto.fail("존재하지 않는 계정입니다."));
        }

        AccountEntity target = opt.get();
        target.setAccountStatus("ACTIVE");
        target.setFailedAttempts(0);
        accountRepository.save(target);

        log.info("🛡️ [관리자 조치] 계정(loginId={}) 휴면/잠금 강제 해제 완료", target.getLoginId());
        return ResponseEntity.ok(ApiResponseDto.ok(null, "계정 (" + target.getLoginId() + ")의 잠금이 정상 해제되었습니다."));
    }
}
