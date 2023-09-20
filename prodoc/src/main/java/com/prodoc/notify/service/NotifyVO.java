package com.prodoc.notify.service;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("NotifyVO")
public class NotifyVO {
	private String displayId;
	private String noteId;
	private String reciveUser;
	private String noteType;
	
	//프로시저 결과 받아오기 위한거
	private String result;
}
