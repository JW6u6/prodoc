package com.prodoc.history.service;

import java.util.Date;

import lombok.Data;

@Data
public class HistoryVO {
	int historyId;
	String workId;
	String creUser;
	
	Date upDate;
	String historyType;	//생성,삭제,수정
	String displayId;
	String pageId;
}
