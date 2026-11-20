package com.chunmyung.saju.security;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.regex.Pattern;

/**
 * 웹 보안 유틸리티:
 * 1) PBKDF2WithHmacSHA256 + 랜덤 Salt 기반 비밀번호 단방향 암호화
 * 2) SQL Injection 시그니처 탐지 및 원천 차단
 * 3) XSS(Cross-Site Scripting) 특수문자 정화(Sanitization)
 */
public class SecurityUtils {

    private static final int SALT_BYTES = 16;
    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256;

    // SQL Injection 공격 패턴 정규식 (UNION, SELECT, DROP, OR 1=1, 주석 --, /* */, 세미콜론 다중 쿼리 등)
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
            "(?i)(\\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|SLEEP|BENCHMARK)\\b)" +
            "|(--|/\\*|\\*/|;)" +
            "|('.*\\b(OR|AND)\\b.*=)" +
            "|(\\b(OR|AND)\\b\\s+\\d+\\s*=\\s*\\d+)"
    );

    private static final Pattern LOGIN_ID_PATTERN = Pattern.compile("^[a-zA-Z0-9_]{4,20}$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^01[016789]-?\\d{3,4}-?\\d{4}$");

    /**
     * SQL 인젝션 공격 문자열 포함 여부 검사
     */
    public static boolean containsSqlInjection(String input) {
        if (input == null || input.isBlank()) {
            return false;
        }
        return SQL_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * 입력값 SQL 인젝션 검증 (탐지 시 IllegalArgumentException 발생)
     */
    public static void validateNoSqlInjection(String... inputs) {
        for (String input : inputs) {
            if (containsSqlInjection(input)) {
                throw new IllegalArgumentException("보안 경고: 허용되지 않는 SQL 인젝션 의심 문자열이 감지되어 요청이 차단되었습니다.");
            }
        }
    }

    /**
     * 아이디 형식 검증 (영문, 숫자, 밑줄 4~20자)
     */
    public static boolean isValidLoginId(String loginId) {
        return loginId != null && LOGIN_ID_PATTERN.matcher(loginId).matches();
    }

    /**
     * 휴대폰 번호 형식 검증
     */
    public static boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone.trim()).matches();
    }

    /**
     * XSS 방어용 HTML 특수문자 이스케이프
     */
    public static String sanitizeXss(String input) {
        if (input == null) return null;
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }

    /**
     * 16바이트 보안 랜덤 Salt 생성
     */
    public static String generateSalt() {
        SecureRandom sr = new SecureRandom();
        byte[] salt = new byte[SALT_BYTES];
        sr.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    /**
     * PBKDF2WithHmacSHA256 알고리즘으로 비밀번호 해싱
     */
    public static String hashPassword(String rawPassword, String base64Salt) {
        try {
            byte[] salt = Base64.getDecoder().decode(base64Salt);
            PBEKeySpec spec = new PBEKeySpec(rawPassword.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = skf.generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("비밀번호 암호화 처리 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * 평문 비밀번호와 저장된 해시 일치 여부 검증 (타이밍 공격 방지 상수 시간 비교)
     */
    public static boolean verifyPassword(String rawPassword, String base64Salt, String expectedHash) {
        String computed = hashPassword(rawPassword, base64Salt);
        if (computed.length() != expectedHash.length()) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < computed.length(); i++) {
            result |= computed.charAt(i) ^ expectedHash.charAt(i);
        }
        return result == 0;
    }

    /**
     * 6자리 보안 SMS 인증번호 생성
     */
    public static String generateSmsCode() {
        SecureRandom sr = new SecureRandom();
        int code = 100000 + sr.nextInt(900000);
        return String.valueOf(code);
    }
}
