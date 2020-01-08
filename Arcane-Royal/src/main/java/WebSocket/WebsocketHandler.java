package WebSocket;

import java.util.ArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


@Component
public class WebsocketHandler extends TextWebSocketHandler {
	int players=0;
	int m;
	String mapas = "";
	ArrayList<WebSocketSession> sessions = new ArrayList<WebSocketSession>();
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
			//System.out.println("Message received: " + message.getPayload());
			//System.out.println(""+players);
			if (message.getPayload().equals("CONNECTION")) {				
				players++;
				session.sendMessage(new TextMessage(""+players));
			}else if(message.getPayload().equals("RONDA")){
				m = (int)(Math.random() * (5));
				mapas = "" + m;
				System.out.println("Mapa: "+ m);
				for (int i=0; i < 4; i++) {
					m = (int)(Math.random() * (5));			 
					System.out.println("Mapa: "+ m);
					mapas += ", "+ m;
				}
				
				session.sendMessage(new TextMessage("{\"tipo\": \"Map\", \"mapas\": ["+ mapas + "]}"));
			}else if (message.getPayload().equals("MAPA")) {
				session.sendMessage(new TextMessage("{\"tipo\": \"Map\", \"mapas\": ["+ mapas + "]}"));
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
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
			for(int i = 0; i < sessions.size(); i++) {
				
				if(sessions.get(i).equals(session)) {
					sessions.remove(i);
				}
				else {
					sessions.get(i).sendMessage(new TextMessage("PlayerDisconnected"));
				}
			}
			players--;
		
	}
	
}