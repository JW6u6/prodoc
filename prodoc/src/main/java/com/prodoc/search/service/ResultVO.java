package com.prodoc.search.service;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class ResultVO {
	String workId;		//wk&db = work 아이디
	String workName;	//wk&db = 워크 이름
	String pageId;		//wk = 페이지 아이디 / db = db id
	String pageName;	//wk = 페이지 이름 / db = db name
	String caseName;	//db의 타입
	String parentId;	//db의 부모 페이지 아이디
	String parentName;	//db의 부모 페이지 이름
	String blockCreUser;//wk의 블럭 생성자 이메일
	String nickName;	//wk의 블럭 생성자 이름
	String displayId;	//wk의 블럭 아이디
	String content;		//wk의 블럭 내용
	@DateTimeFormat(pattern = "yyyy-mm-dd")
	Date displayCreDate;//블럭 생성일
	@DateTimeFormat(pattern = "yyyy-mm-dd")
	Date displayUpDate;//블럭 최종 업데이트일
}
