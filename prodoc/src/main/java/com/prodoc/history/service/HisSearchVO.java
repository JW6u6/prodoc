package com.prodoc.history.service;

import lombok.Data;

@Data
public class HisSearchVO {
	String logUser;
	String select;
	String startDate;
	String endDate;
}
