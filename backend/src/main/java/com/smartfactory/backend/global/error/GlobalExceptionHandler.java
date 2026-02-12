package com.smartfactory.backend.global.error;

import com.smartfactory.backend.global.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // ⭐ 모든 컨트롤러에서 발생하는 예외를 여기서 잡음.
@Slf4j
public class GlobalExceptionHandler {

    /**
     * @Valid 유효성 검사 실패 시 (400 Bad Request)
     * DTO에서 작성한 @NotBlank, @Min 등의 조건이 안 맞을 때 발생.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // 어떤 필드가 왜 틀렸는지 수집
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Validation Error: {}", errors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of("입력값 유효성 검사에 실패했습니다.", HttpStatus.BAD_REQUEST, errors));
    }

    /**
     * 비즈니스 로직 에러 (400 Bad Request)
     * Service에서 throw new IllegalArgumentException("재고 부족") 등을 던지면 여기서 잡음.
     */
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ErrorResponse> handleBusinessException(RuntimeException ex) {
        log.warn("Business Logic Error: {}", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(ex.getMessage(), HttpStatus.BAD_REQUEST));
    }

    /**
     * 그 외 예상치 못한 모든 서버 에러 (500 Internal Server Error)
     * NullPointerException 등 개발자가 미처 잡지 못한 에러.
     * 보안상 상세 에러 내용(Stack Trace)은 숨기고, 로그에만 남김.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        log.error("Unexpected Server Error: ", ex); // 서버 로그에는 상세히 남김

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of("서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.", HttpStatus.INTERNAL_SERVER_ERROR));
    }
}