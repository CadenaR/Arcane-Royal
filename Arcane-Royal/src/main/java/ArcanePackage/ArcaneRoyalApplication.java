package ArcanePackage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.context.annotation.Bean;
import WebSocket.WebsocketHandler;

@SpringBootApplication
@EnableWebSocket
public class ArcaneRoyalApplication implements WebSocketConfigurer{	
	@Override
	public void registerWebSocketHandlers(
		WebSocketHandlerRegistry registry) {
		registry.addHandler(echoHandler(), "/echo")
		.setAllowedOrigins("*");
	}
	
	@Bean
	public WebsocketHandler echoHandler() {
		return new WebsocketHandler();
	}

	
	public static void main(String[] args) {
		SpringApplication.run(ArcaneRoyalApplication.class, args);
	}

}
