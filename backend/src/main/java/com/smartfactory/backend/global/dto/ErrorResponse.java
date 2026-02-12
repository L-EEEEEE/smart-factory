package com.smartfactory.backend.global.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Getter
@Builder
public class ErrorResponse {

    private boolean success; // 성공 여부 (false)
    private String message;  // 에러 메시지
    private int status;      // HTTP 상태 코드 (400, 404, 500 등)

    // @Valid 검사 실패 시, 어떤 필드가 틀렸는지 상세 정보 (선택 사항)
    private Map<String, String> validationErrors;

    /**
     * 일반적인 에러 응답 생성
     */
    public static ErrorResponse of(String message, HttpStatus status) {
        return ErrorResponse.builder()
                .success(false)
                .message(message)
                .status(status.value())
                .build();
    }

    /**
     * 유효성 검사 실패(Validation Error) 응답 생성
     */
    public static ErrorResponse of(String message, HttpStatus status, Map<String, String> validationErrors) {
        return ErrorResponse.builder()
                .success(false)
                .message(message)
                .status(status.value())
                .validationErrors(validationErrors)
                .build();
    }
}