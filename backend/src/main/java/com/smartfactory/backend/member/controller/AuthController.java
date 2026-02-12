package com.smartfactory.backend.member.controller;

import com.smartfactory.backend.global.config.JwtTokenProvider;
import com.smartfactory.backend.member.dto.LoginRequest;
import com.smartfactory.backend.member.domain.Member;
import com.smartfactory.backend.member.repository.MemberRepository;
import com.smartfactory.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 1. ID로 회원 조회
        Member member = memberRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 아이디입니다."));

        // 2. 비밀번호 검증
        // member.getPassword().equals(request.getPassword()) 절대 안됨
        // passwordEncoder.matches(평문, 암호화된값)
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 토큰 발급
        String token = jwtTokenProvider.createToken(member.getUsername(), member.getRole());
        return ResponseEntity.ok(token);
    }
}