package com.smartfactory.backend.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SignupRequest {
    private String username;
    private String password;
    // 이메일이나 닉네임 등 추가 정보가 필요하면 여기에 추가
}
