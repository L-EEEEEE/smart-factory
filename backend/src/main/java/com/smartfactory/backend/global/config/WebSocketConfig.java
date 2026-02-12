package com.smartfactory.backend.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-factory")
//                .setAllowedOriginPatterns("*") // 모든 출처 허용 (보안상 개발환경에서만 권장)
                .setAllowedOriginPatterns("http://localhost:5173") // 또는 특정 프론트엔드 주소 지정
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 1. 구독(Subscribe)하는 주소의 접두사 (여기서 "/topic"을 허용해줘야 함)
        config.enableSimpleBroker("/topic");

        // 2. 메시지 보낼 때(Publish) 붙이는 접두사
        config.setApplicationDestinationPrefixes("/app");
    }
}
