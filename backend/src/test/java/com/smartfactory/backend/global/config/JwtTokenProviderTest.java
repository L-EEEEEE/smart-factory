package com.smartfactory.backend.global.config;

import com.smartfactory.backend.global.config.JwtTokenProvider; // 패키지 경로 주의!
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class JwtTokenProviderTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("토큰 생성 및 유효성 검증 테스트")
    void tokenCreateAndValidateTest() {
        // given
        String username = "testAdmin";
        String role = "ROLE_ADMIN";

        // when
        String token = jwtTokenProvider.createToken(username, role);

        // then
        System.out.println("Generated Token: " + token);
        assertThat(token).isNotNull(); // 토큰이 비어있으면 안됨
        assertThat(jwtTokenProvider.validateToken(token)).isTrue(); // 유효성 검사 통과해야 함
    }

    @Test
    @DisplayName("토큰에서 회원 아이디 추출 테스트")
    void getUsernameFromTokenTest() {
        // given
        String username = "user1";
        String token = jwtTokenProvider.createToken(username, "ROLE_USER");

        // when
        String extractedUsername = jwtTokenProvider.getUsername(token);

        // then
        assertThat(extractedUsername).isEqualTo(username);
    }
}