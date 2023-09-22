package com.prodoc.search.service;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class SearchVO {
	String keyword;
	String startDate;
	String endDate;
	//List<Map<String, String>> check;
}
