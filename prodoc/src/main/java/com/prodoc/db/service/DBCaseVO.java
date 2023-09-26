package com.prodoc.db.service;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("DBCaseVO")
public class DBCaseVO {
	// INSERT_DB 프로시저에 사용
	public String workId;
	public String email;
	public String prentPage;
	public String displayId;
	public String result;
}
