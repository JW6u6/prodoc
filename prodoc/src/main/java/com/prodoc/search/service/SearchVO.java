package com.prodoc.search.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class SearchVO {
	String logUser;
	String keyword;
	String type;	//검색 유형이 wk or db
	String startDate;
	String endDate;
	
	//db 선택 조건
	List<Map<String, String>> check;
}
