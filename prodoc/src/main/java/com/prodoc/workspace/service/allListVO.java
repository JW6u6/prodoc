package com.prodoc.workspace.service;

import lombok.Data;

@Data
public class allListVO {
	private int level;
	private String wp;
	private String pageId;
	private String workId;
	private String parentId;
	private String workType;
	private String workName;
	private String deleteCheck;
	private String numbering;
	private String caseId;
}
