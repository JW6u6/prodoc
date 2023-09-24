package com.prodoc.page.service;

import java.sql.Date;

import lombok.Data;

@Data
public class PageVO {
	private String pageId;
	private String parentId;
	private String pageName;
	private String creUser;
	private Date creDate;
	private String workId;
	private String delCheck;
	private int numbering;
	private String lockCheck;
	private String caseId;
	private String pubCheck;
	private String upDate;
	
	
	//페이지 알림 끄기/켜기를 위한...
	private String email;
	private int result;
	
	//프로시저용
	private String outPid;
	private String insertResult;
}
