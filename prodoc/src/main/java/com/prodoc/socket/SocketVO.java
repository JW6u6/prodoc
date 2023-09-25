package com.prodoc.socket;

import lombok.Data;

@Data
public class SocketVO {
	
	private String cmd;
	private String connect;
	
	public SocketVO(String cmd, String connect) {
		super();
		this.cmd = cmd;
		this.connect = connect;
	}
	
	
}
