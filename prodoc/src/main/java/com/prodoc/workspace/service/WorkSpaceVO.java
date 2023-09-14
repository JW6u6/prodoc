package com.prodoc.workspace.service;

import java.sql.Date;

import lombok.Data;

@Data
public class WorkSpaceVO {
	private String workId;
	private String parentId;
	private String workType;
	private String workName;
	private Date creDate;
	private String delCheck;
	private String pubCheck;
	private String mainId;
	private int numbering;
}
