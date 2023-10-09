package com.prodoc.db.service;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("DBCaseVO")
public class DBCaseVO {
	// INSERT_DB 프로시저에 사용
	public String result;	//생성성공시 페이지 아이디 반환
	public String parentId;	//DB의 부모 페이지 id
	public String pageName;
	public String email;
	public String pageNum;	//페이지넘버링
	public String caseId;	//DB_LIST or DB_BRD 등
	public String displayId;
	public String blockNum;	//블럭넘버링
}
