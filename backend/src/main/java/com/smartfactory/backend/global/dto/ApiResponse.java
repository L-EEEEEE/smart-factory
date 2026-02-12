package com.smartfactory.backend.global.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success; // 성공 여부 (true)
    private String message;  // 응답 메시지
    private T data;          // 실제 데이터 (JSON 객체)

    /**
     * 데이터만 보내는 성공 응답 (기본 메시지 사용)
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "요청이 성공적으로 처리되었습니다.", data);
    }

    /**
     * 메시지와 데이터를 함께 보내는 성공 응답
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data);
    }

    /**
     * 데이터 없이 메시지만 보내는 경우 (삭제, 수정 등)
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }
}