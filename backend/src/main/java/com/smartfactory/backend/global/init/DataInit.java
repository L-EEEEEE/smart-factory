package com.smartfactory.backend.global.init;

import com.smartfactory.backend.member.domain.Member;
import com.smartfactory.backend.member.repository.MemberRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInit {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder; // 암호화기 주입

    @PostConstruct
    public void init() {
        // admin 계정이 없을 때만 생성
        if (memberRepository.findByUsername("admin").isEmpty()) {
            Member admin = Member.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("1234")) // 비밀번호 암호화 필수!
                    .role("ROLE_ADMIN") // ⭐ 중요: 권한을 ADMIN으로 설정
                    .build();

            memberRepository.save(admin);
            System.out.println("👑 초기 최고 관리자 계정 생성 완료: admin / 1234");
        }
    }
}