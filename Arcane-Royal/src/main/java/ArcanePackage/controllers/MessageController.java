package ArcanePackage.controllers;

import java.util.List;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ArcanePackage.Message;
import ArcanePackage.MessageRepository;

// Obtenido de ejercicio de manejo de items en clase
@RestController
@RequestMapping("/messages")
public class MessageController {
	@Autowired
	private MessageRepository repo;

	@RequestMapping(method = RequestMethod.GET)
	public List<Message> findMessage() {
		return repo.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Message> addMessage(@RequestBody Message message, HttpServletRequest request) {
		message.setId(null);
		//https://www.mkyong.com/java/how-to-get-client-ip-address-in-java/
		String remoteAddr = "";
		if (request != null) {
            remoteAddr = request.getHeader("X-FORWARDED-FOR");
            if (remoteAddr == null || "".equals(remoteAddr)) {
            	message.setIp(request.getRemoteAddr());
            }
        }
		
		Message newMessage = repo.saveAndFlush(message);
		return new ResponseEntity<>(newMessage,HttpStatus.CREATED);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<Message> updateMessage(@RequestBody Message updatedMessage,
			@PathVariable Integer id) {
		
		updatedMessage.setId(id);
		Message message = repo.saveAndFlush(updatedMessage);
		return new ResponseEntity<>(message,HttpStatus.CREATED);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteMessage(@PathVariable Integer id) {
		repo.deleteById(id);
	}

}
