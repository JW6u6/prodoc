package com.prodoc.file.service;

import java.util.Date;

import lombok.Data;

@Data
public class FileVO {
	private String displayId;
	private String path;
	private Date saveDate;
	private String upName;
	private String newName;
}