package com.prodoc.history.mapper;

import java.util.List;

import com.prodoc.history.service.HisSearchVO;
import com.prodoc.history.service.HistoryVO;

public interface HistoryMapper {
	public List<HistoryVO> selectList(HisSearchVO search);	//히스토리 목록
}
