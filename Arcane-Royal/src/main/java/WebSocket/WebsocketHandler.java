package WebSocket;

import java.util.ArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


@Component
public class WebsocketHandler extends TextWebSocketHandler {
	int players=0;
	int mapa;
	ArrayList<WebSocketSession> sessions = new ArrayList<WebSocketSession>();
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
			System.out.println("Message received: " + message.getPayload());
			System.out.println(""+players);
			if (message.getPayload().equals("CONNECTION")) {				
				players++;
				session.sendMessage(new TextMessage(""+players));
			}else if(message.getPayload().equals("RONDA")){
				mapa = (int)(Math.random() * (5));
				System.out.println("Mapa: "+ mapa);
				for (WebSocketSession sess : sessions) {
					sess.sendMessage(new TextMessage(""+mapa));
				}
			}else if (message.getPayload().equals("MAPA")) {
				session.sendMessage(new TextMessage(""+mapa));
			}else if (message.getPayload().equals("DISCONNECTION")) {
				for(int i = 0; i < sessions.size(); i++) {
					if(sessions.get(i).equals(session)) {
						sessions.remove(i);
					}
				}
				players--;		
			}
			else
			{
				String msg = message.getPayload();
				for (WebSocketSession sess : sessions) {
			        sess.sendMessage(new TextMessage(msg));
				}
				
			}
	}
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		sessions.add(session);
	}
}