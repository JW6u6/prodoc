package com.prodoc.history.service;

import java.util.Date;

import lombok.Data;

@Data
public class HistoryVO {
	int historyId;
	String historyType;	//생성,삭제,수정,복구

	String workId;
	String workName;
	
	String pageId;
	String pageName;
	String displayId;
	
	String creUser;
	String nickname;
	
	Date upDate;
}
