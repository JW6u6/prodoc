package com.prodoc.history.service;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class HisSearchVO {
	String logUser;
	String select;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	Date startDate;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	Date endDate;
}
