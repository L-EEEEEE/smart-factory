package com.smartfactory.backend.member.service;

import com.smartfactory.backend.member.domain.Member;
import com.smartfactory.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder; // 👈 주입받기

    public void signup(String username, String rawPassword) {
        // 1. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 2. 암호화된 비밀번호로 저장
        Member member = Member.builder()
                .username(username)
                .password(encodedPassword) // 👈 암호화된 값 저장
                .role("ROLE_USER")
                .build();

        memberRepository.save(member);
    }

}
