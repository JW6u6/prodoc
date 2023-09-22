package com.prodoc.search.service;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class ResultVO {
	String workId;
	String pageId;
	String displayId;
	String workName;
	String pageName;
	String content;
	@DateTimeFormat(pattern = "yyyy-mm-dd")
	Date pageUpDate;
	
}
