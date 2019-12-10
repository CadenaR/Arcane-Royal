package ArcanePackage;

import javax.persistence.*;

@Entity
public class Connection {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column
	private String userName;
	
	@Column
	private boolean connected;
	
	@Column
	private String ip;
	
	@Column
	private String date;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getUser() {
		return this.userName;
	}
	
	public void setUser (String user) {
		this.userName=user;
	}

	public boolean isConnected() {
		return connected;
	}

	public void setChecked(boolean checked) {
		this.connected = checked;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}
	
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

}
