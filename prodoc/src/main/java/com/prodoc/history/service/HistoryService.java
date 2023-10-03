package com.prodoc.history.service;

import java.util.List;

public interface HistoryService {
	public List<HistoryVO> getHistory(HisSearchVO search);	//히스토리 목록
}
