package com.prodoc.file.service;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("FileVO")
public class FileVO {
	private String displayId;
	private String path;
	private Date saveDate;
	private String upName;
	private String newName;
}