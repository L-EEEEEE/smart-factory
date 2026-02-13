package com.smartfactory.backend.global.init;

import com.smartfactory.backend.material.domain.Material;
import com.smartfactory.backend.material.repository.MaterialRepository;
import com.smartfactory.backend.member.domain.Member;
import com.smartfactory.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MaterialRepository materialRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder; // 암호화기 주입

    @Override
    public void run(String... args) throws Exception {
        // admin 계정이 없을 때만 생성
        if (memberRepository.findByUsername("admin").isEmpty()) {
            Member admin = Member.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("1234")) // 비밀번호 암호화 필수!
                    .role("ROLE_ADMIN") // ⭐ 중요: 권한을 ADMIN으로 설정
                    .build();

            memberRepository.save(admin);
            log.info("초기 최고 관리자 계정 생성 완료: admin / 1234");
        }
    }
}