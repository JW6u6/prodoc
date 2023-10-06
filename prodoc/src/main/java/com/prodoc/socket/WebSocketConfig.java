package com.prodoc.socket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		// 해당 URI를 브로커로 쓰겠다.
		config.enableSimpleBroker("/topic");
		// Send(업데이트 알림요청)
		// 클라이언트에서 보낸 메세지중 해당 경로(/app)로 시작하는 메세지를 메세지 브로커에서 처리
		config.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// End포인트 (웹소켓 요청한곳으로 보내줌)
		// 해당경로로 handshake (연결하겠다는 뜻)
		registry.addEndpoint("/websocket").setAllowedOrigins("*");
	}

}