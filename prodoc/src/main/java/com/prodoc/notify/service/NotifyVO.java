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
}
