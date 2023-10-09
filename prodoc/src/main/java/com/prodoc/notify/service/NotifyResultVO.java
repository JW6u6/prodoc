package com.prodoc.notify.service;

import java.sql.Date;

import lombok.Data;

@Data
public class NotifyResultVO {
	private String noteId;
	private String userName;
	private String workName;
	private Date creDate;
	private String content;
	private String profile;
}
