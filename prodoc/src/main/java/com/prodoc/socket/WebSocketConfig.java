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
		// topic으로 시작하는것은 전달만 해줌
		config.enableSimpleBroker("/topic");
		// Send(업데이트 알림요청)
		// 클라이언트에서 보낸 메세지중에서 app으로 시작하는것은 서버에서 처리후 전달받음.
		config.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// End포인트 (웹소켓 요청한곳으로 보내줌)
		// 해당경로로 handshake (연결하겠다는 뜻)
		registry.addEndpoint("/websocket").setAllowedOrigins("*");
	}

}