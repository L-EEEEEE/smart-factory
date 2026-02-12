package com.smartfactory.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

     private final JwtTokenProvider jwtTokenProvider;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. CORS 설정: "corsConfigurationSource라는 설정을 따르라"
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. CSRF, FormLogin 등 불필요한 설정 끄기
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // 3. 권한 규칙 설정 (순서가 매우 중요합니다!)
                .authorizeHttpRequests(auth -> auth
                        // Preflight(OPTIONS) 요청은 토큰 없어도 무조건 허용
                        .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()

                        // 로그인, 회원가입, WebSocket 연결 주소는 누구나 접근 가능
                        .requestMatchers("/api/auth/**", "/ws-factory/**", "/api/machines/**").permitAll()

                        // 관리자 페이지는 ADMIN만
                        .requestMatchers("/api/inventory/**").hasRole("ADMIN")
                        .requestMatchers("/api/pricing/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 나머지는 인증 필요
                        .anyRequest().authenticated()
                );

        // (JWT 필터 추가 코드가 있다면 여기에 작성)
        // .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 4. 구체적인 CORS 허용 규칙
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 프론트엔드 주소 허용 (포트 5173 확인!)
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));

        // 모든 메서드 허용 (GET, POST, OPTIONS, PUT, DELETE)
        config.setAllowedMethods(List.of("*"));

        // 모든 헤더 허용 (Authorization 포함)
        config.setAllowedHeaders(List.of("*"));

        // 인증 정보(쿠키, 토큰) 허용
        config.setAllowCredentials(true);

        // 브라우저가 Authorization 헤더를 읽을 수 있게 허용
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}