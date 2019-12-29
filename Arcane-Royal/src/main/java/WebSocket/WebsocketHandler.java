package WebSocket;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class WebsocketHandler extends TextWebSocketHandler {
	int players=0;
	WebSocketSession session1;
	WebSocketSession session2;
	
	@Override
	protected void handleTextMessage(
		WebSocketSession session,
		TextMessage message) throws Exception {
			System.out.println("Message received: " + message.getPayload());
			System.out.println(""+players);
			if (message.getPayload().equals("CONNECTION")) {
				if (players==0) {
					session1=session;
				}else {
					session2=session;
				}
				players++;
				session.sendMessage(new TextMessage(""+players));
			}else if (message.getPayload().equals("DISCONNECTION")) {
				players--;		
			}
			else
			{
				String msg = message.getPayload();
				if(session2!=null) {
					session1.sendMessage(new TextMessage(msg));
					session2.sendMessage(new TextMessage(msg));
				}
			}
	}
}