package com.smartfactory.backend.global.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor // JSON 파싱을 위해 빈 생성자가 필요합니다.
public class LoginRequest {
    private String username;
    private String password;
}