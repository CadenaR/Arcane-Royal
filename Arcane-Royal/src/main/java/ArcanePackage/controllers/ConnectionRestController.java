package ArcanePackage.controllers;

import java.util.List;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ArcanePackage.Connection;
import ArcanePackage.ConnectionRepository;

// Obtenido de ejercicio de manejo de items en clase
@RestController
@RequestMapping("/connections")
public class ConnectionRestController {
	@Autowired
	private ConnectionRepository repo;

	@RequestMapping(method = RequestMethod.GET)
	public List<Connection> findConnection() {
		return repo.findAll();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Connection> addConnection(@RequestBody Connection connection, HttpServletRequest request) {
		connection.setId(null);
		//https://www.mkyong.com/java/how-to-get-client-ip-address-in-java/
		String remoteAddr = "";
		if (request != null) {
            remoteAddr = request.getHeader("X-FORWARDED-FOR");
            if (remoteAddr == null || "".equals(remoteAddr)) {
                connection.setIp(request.getRemoteAddr());
            }
        }
		
		Connection newConnection = repo.saveAndFlush(connection);
		return new ResponseEntity<>(newConnection,HttpStatus.CREATED);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<Connection> updateConnection(@RequestBody Connection updatedConnection,
			@PathVariable Integer id, @PathVariable String user) {
		
		updatedConnection.setId(id);
		updatedConnection.setUser(user);
		Connection connection = repo.saveAndFlush(updatedConnection);
		return new ResponseEntity<>(connection,HttpStatus.CREATED);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void deleteConnection(@PathVariable Integer id) {
		repo.deleteById(id);
	}

}
