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
	
	//프로시저 out 담아오기 위한 필드명
	private String result; //결과 받아옴
	private String outWid; //초대에 쓰기 위해서 out으로 워크스페이스 값 받아옴
	
	//워크 스페이스 생성하면서 멤버 테이블에 생성자를 넣기 위한...그거
	private String email;
	 
}