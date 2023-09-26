package com.prodoc.trash.service;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class TrashResultVO {
	int historyId;
	String workId;
	String workName;
	String pageId;
	String pageName;
	String upDate;	//삭제일
	String creUser;	//삭제한 사람
	
}
