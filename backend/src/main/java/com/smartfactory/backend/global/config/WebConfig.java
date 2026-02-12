package com.smartfactory.backend.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")             // 모든 API 경로에 대해
                .allowedOrigins("http://localhost:5173") // 이 주소의 접근을 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE"); // 허용할 HTTP 메서드
    }
}