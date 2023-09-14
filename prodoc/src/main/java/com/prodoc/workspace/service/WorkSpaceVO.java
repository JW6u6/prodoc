package com.prodoc.workspace.service;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("WorkSpaceVO")
public class WorkSpaceVO {
	private String workId;
	private String parentId;
	private String workType;
	private String workName;
	private Date workCredate;
	private String deleteCheck;
	private String publicCheck;
	private String MainPageId;
	private int numbering;
	
	private String result;
	
	//워크 스페이스 생성하면서 멤버 테이블에 생성자를 넣기 위한...그거
	private String email;
}
