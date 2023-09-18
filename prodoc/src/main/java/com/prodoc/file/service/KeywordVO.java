package com.prodoc.file.service;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("KeywordVO")
public class KeywordVO {
	private String email;
	private String keyword;
	private String startDate;
	private String endDate;
	private String pageName;
	private String upName;
	private String upUser;
	private String workName;
}
