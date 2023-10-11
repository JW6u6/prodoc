package com.prodoc.socket;

import lombok.Data;

// 데이터를 전달하는 객체 
@Data
public class SocketVO {
	private int cmd;   //명령어 구분
	private String connect; // 해당 명령의 ID값.(예를들어 page면 pageId , work면 workId..)
	
	public SocketVO(int cmd, String connect) {
		super();
		this.cmd = cmd;
		this.connect = connect;
	}
	
	
}
