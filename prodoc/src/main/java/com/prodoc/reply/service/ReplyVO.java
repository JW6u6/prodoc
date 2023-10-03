package com.prodoc.reply.service;

import java.sql.Date;

import lombok.Data;

@Data
public class ReplyVO {
	private String replyId;
	private String creUser;
	private Date creDate;
	private Date upDate;
	private String content;
	private String displayId;
	private String mentionList;
	private String pageId;
}
