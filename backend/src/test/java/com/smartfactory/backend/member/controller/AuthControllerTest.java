package com.smartfactory.backend.member.controller;

import com.smartfactory.backend.member.domain.Member;
import com.smartfactory.backend.member.repository.MemberRepository;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional // 테스트 끝나면 DB 롤백 (데이터 오염 방지)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // 테스트용 계정 생성
        if (memberRepository.findByUsername("testuser").isEmpty()) {
            memberRepository.save(Member.builder()
                    .username("testuser")
                    .password("{noop}1234") // 테스트용 비암호화 비번
                    .role("ROLE_USER")
                    .build());
        }
    }

    @Test
    @DisplayName("로그인 성공 시 토큰 반환")
    void loginSuccessTest() throws Exception {
        // given
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "testuser");
        loginRequest.put("password", "1234");

        // when & then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk()) // 200 OK
                .andDo(print()); // 콘솔에 결과 출력
    }

    @Test
    @DisplayName("로그인 실패 - 비밀번호 틀림")
    void loginFailTest() throws Exception {
        // given
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "testuser");
        loginRequest.put("password", "wrongpassword");

        // when & then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().is4xxClientError()) // 401 or 403 or 500 (설정에 따라 다름, 보통 예외 터지면 500이나 401)
                .andDo(print());
    }
}