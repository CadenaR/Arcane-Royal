package WebSocket;

import java.util.ArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class WebsocketHandler extends TextWebSocketHandler {
	int m;
	String mapas = "";
	ArrayList<WebSocketSession[]> sessions = new ArrayList<WebSocketSession[]>();

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		// System.out.println("Message received: " + message.getPayload());
		// System.out.println(""+players);
		if (message.getPayload().equals("RONDA")) {
			mapas = "";
			m = (int) (Math.random() * (5));
			mapas += "" + m;
			System.out.println("Mapa: " + m);
			for (int i = 0; i < 4; i++) {
				m = (int) (Math.random() * (5));
				System.out.println("Mapa: " + m);
				mapas += ", " + m;
			}

			session.sendMessage(new TextMessage("{\"tipo\": \"Map\", \"mapas\": [" + mapas + "]}"));
		} else if (message.getPayload().equals("MAPA")) {
			session.sendMessage(new TextMessage("{\"tipo\": \"Map\", \"mapas\": [" + mapas + "]}"));
		} else {
			int[] sInfo = searchSession(session);
			int i = sInfo[0];
			int j = sInfo[1];
			
			if (message.getPayload().equals("Jugar")) { // si llega mensaje Jugar, se avisa al otro lado de la sesión que puede iniciar partida
				if(j == 0) {
					if (sessions.get(i)[1] != null) {
						if(sessions.get(i)[1].isOpen()) {
							sessions.get(i)[0].sendMessage(new TextMessage("{\"tipo\": \"Jugar\"}"));
							sessions.get(i)[1].sendMessage(new TextMessage("{\"tipo\": \"Jugar\"}"));
						}
					}
				}

			} else {
				String msg = message.getPayload();
				if (sessions.get(i)[0] != null) {
					if(sessions.get(i)[0].isOpen()) {
						sessions.get(i)[0].sendMessage(new TextMessage(msg));
					}
				}
				if (sessions.get(i)[1] != null) {
					if(sessions.get(i)[1].isOpen()) {
						sessions.get(i)[1].sendMessage(new TextMessage(msg));
					}
				}
			}
		}	
	}

	// Crea parejas de sesiones o complementa una pareja
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		//Creación de la primer sesión
		if (sessions.size() == 0) {
			sessions.add(new WebSocketSession[2]);
			sessions.get(0)[0] = session;
			session.sendMessage(new TextMessage("" + 1));
		} else {
			int sesNum = 1;
			for (WebSocketSession[] sess : sessions) {
				for (int i = 0; i < 2; i++) {
					if (sess[i] == null) {
						sess[i] = session;
						session.sendMessage(new TextMessage("" + (i + 1)));
						return;
					}
					else if(!sess[i].isOpen()) {
						sess[i] = session;
						session.sendMessage(new TextMessage("" + (i + 1)));
						return;
					}
				}
				sesNum++;
			}

			sessions.add(new WebSocketSession[2]);
			sessions.get(sesNum - 1)[0] = session;
			session.sendMessage(new TextMessage("" + 1));
		}
	}

	/*
	 * Convierte a null el espacio en el arreglo donde se encuentra la sesion y
	 * envía un mensaje de que se ha desconectado el otro jugador. Si las dos
	 * sesiones de esa pareja se encuentran desocupadas, elimina esa pareja de la
	 * lista
	 */

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		int[] sInfo = searchSession(session);
		int i = sInfo[0];
		int j = sInfo[1];
		if (i != -1) {
			sessions.get(i)[j] = null;
			if (j == 0 && sessions.get(i)[1] != null) {
				if(sessions.get(i)[1].isOpen())
					sessions.get(i)[1].sendMessage(new TextMessage("{\"tipo\": \"PlayerDisconnected\"}"));
				return;
			} else if (j == 1 && sessions.get(i)[0] != null) {
				if(sessions.get(i)[0].isOpen())
					sessions.get(i)[0].sendMessage(new TextMessage("{\"tipo\": \"PlayerDisconnected\"}"));
				return;
			}else {
				sessions.remove(i);
			}

			
			return;
		}
	}

	// Recibe la sesión a buscar y regresa su posición del arreglo y la lista
	public int[] searchSession(WebSocketSession session) {
		int[] sessionInfo = new int[2];
		sessionInfo[0] = -1;
		sessionInfo[1] = -1;
		for (int i = 0; i < sessions.size(); i++) {
			for (int j = 0; j < 2; j++) {
				if (sessions.get(i)[j] != null) {
					if (sessions.get(i)[j].equals(session)) {
						sessionInfo[0] = i;
						sessionInfo[1] = j;
					}
				}
			}
		}
		return sessionInfo;

	}

}