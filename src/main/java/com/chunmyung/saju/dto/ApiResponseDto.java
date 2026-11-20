package com.chunmyung.saju.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseDto<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponseDto<T> ok(T data, String message) {
        return ApiResponseDto.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponseDto<T> fail(String message) {
        return ApiResponseDto.<T>builder()
                .success(false)
                .message(message)
                .data(null)
                .build();
    }
}
