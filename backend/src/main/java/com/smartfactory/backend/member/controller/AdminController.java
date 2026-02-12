package com.smartfactory.backend.member.controller;

import com.smartfactory.backend.member.dto.SignupRequest;
import com.smartfactory.backend.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin") // 👈 이 주소는 관리자만 들어갈 수 있음 (Config 설정 덕분)
@RequiredArgsConstructor
public class AdminController {

    private final MemberService memberService;

    // 사원 계정 생성 API
    @PostMapping("/members")
    public ResponseEntity<?> createMember(@RequestBody SignupRequest request) {
        try {
            // 기본은 USER 권한으로 생성 (필요하면 DTO에 role 필드 추가해서 받으세요)
            memberService.signup(request.getUsername(), request.getPassword());
            return ResponseEntity.ok("사원 계정 생성 완료!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("계정 생성 실패: " + e.getMessage());
        }
    }
}