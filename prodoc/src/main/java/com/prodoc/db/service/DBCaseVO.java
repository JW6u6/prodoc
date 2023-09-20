package com.prodoc.db.service;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("DBCaseVO")
public class DBCaseVO {
	public String wordId;
	public String email;
	public String prentPage;
	public String displayId;
	public String result;
}
