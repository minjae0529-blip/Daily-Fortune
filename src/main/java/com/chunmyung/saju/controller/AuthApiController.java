package com.chunmyung.saju.controller;

import com.chunmyung.saju.dto.ApiResponseDto;
import com.chunmyung.saju.dto.AuthDtos.*;
import com.chunmyung.saju.entity.AccountEntity;
import com.chunmyung.saju.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "회원가입 · 보안 로그인 · SMS 휴면해제 API", description = "PBKDF2 암호화, SQL 인젝션 차단, 5회 오류 SMS 발송, 10회 오류 휴면화 및 인증번호 해제 API")
public class AuthApiController {

    private static final String SESSION_ACCOUNT_ID = "CHUNMYUNG_AUTH_ACCOUNT_ID";
    private final AuthService authService;

    @Operation(summary = "아이디 중복 확인", description = "회원가입 시 아이디 중복 여부와 SQL 인젝션 안전성을 검사합니다.")
    @GetMapping("/check-id")
    public ResponseEntity<ApiResponseDto<Boolean>> checkId(@RequestParam String loginId) {
        try {
            return ResponseEntity.ok(authService.checkDuplicateId(loginId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponseDto.fail(e.getMessage()));
        }
    }

    @Operation(summary = "회원가입", description = "ID, 비밀번호(PBKDF2+Salt 해싱), 이름, 휴대폰 번호를 등록합니다.")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponseDto<AuthStatusResponse>> signup(
            @RequestBody SignupRequest req,
            HttpSession session) {
        try {
            ApiResponseDto<AuthStatusResponse> res = authService.registerAccount(req);
            if (res.isSuccess() && res.getData() != null) {
                session.setAttribute(SESSION_ACCOUNT_ID, res.getData().getAccountId());
            }
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponseDto.fail(e.getMessage()));
        }
    }

    @Operation(summary = "보안 로그인", description = "1~4회 실패 시 경고, 5~9회 실패 시 휴대폰 SMS 발송, 10회 이상 실패 시 계정을 휴면화합니다.")
    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto<AuthStatusResponse>> login(
            @RequestBody LoginRequest req,
            HttpSession session) {
        try {
            ApiResponseDto<AuthStatusResponse> res = authService.loginAccount(req);
            if (res.isSuccess() && res.getData() != null && res.getData().isAuthenticated()) {
                session.setAttribute(SESSION_ACCOUNT_ID, res.getData().getAccountId());
            }
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponseDto.fail(e.getMessage()));
        }
    }

    @Operation(summary = "휴대폰 SMS 인증번호 발송", description = "계정 휴면/잠금 해제를 위해 등록된 휴대폰 번호로 6자리 인증번호 문자를 발송합니다.")
    @PostMapping("/sms/send")
    public ResponseEntity<ApiResponseDto<AuthStatusResponse>> sendSms(@RequestBody SmsSendRequest req) {
        try {
            return ResponseEntity.ok(authService.sendUnlockSms(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponseDto.fail(e.getMessage()));
        }
    }

    @Operation(summary = "SMS 인증번호 검증 및 계정 휴면 해제", description = "6자리 SMS 인증번호를 검증하여 10회 이상 오류로 휴면화된 계정을 정상 활성화합니다.")
    @PostMapping("/sms/unlock")
    public ResponseEntity<ApiResponseDto<AuthStatusResponse>> unlockWithSms(@RequestBody SmsUnlockRequest req) {
        try {
            return ResponseEntity.ok(authService.unlockAccountWithSms(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponseDto.fail(e.getMessage()));
        }
    }

    @Operation(summary = "현재 로그인 세션 조회", description = "현재 브라우저 세션의 로그인 상태를 확인합니다.")
    @GetMapping("/me")
    public ResponseEntity<ApiResponseDto<AuthStatusResponse>> me(HttpSession session) {
        Object idObj = session.getAttribute(SESSION_ACCOUNT_ID);
        if (idObj instanceof Long accountId) {
            Optional<AccountEntity> opt = authService.findById(accountId);
            if (opt.isPresent()) {
                AuthStatusResponse status = authService.toStatusResponse(opt.get(), true, false, null, null);
                return ResponseEntity.ok(ApiResponseDto.ok(status, "로그인 세션이 유효합니다."));
            }
        }
        return ResponseEntity.ok(ApiResponseDto.fail("로그인이 필요합니다."));
    }

    @Operation(summary = "로그아웃", description = "현재 세션을 종료하고 로그인 화면으로 돌아갑니다.")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDto<Boolean>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(ApiResponseDto.ok(true, "안전하게 로그아웃되었습니다."));
    }
}
