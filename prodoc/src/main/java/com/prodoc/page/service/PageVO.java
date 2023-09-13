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
}
