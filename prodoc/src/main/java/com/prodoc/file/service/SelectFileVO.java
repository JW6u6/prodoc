package com.prodoc.file.service;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("SelectFileVO")
public class SelectFileVO {
	private String upName;
	private String nickName;
	private String pageName;
	private Date saveDate;
	private String displayId;
}
