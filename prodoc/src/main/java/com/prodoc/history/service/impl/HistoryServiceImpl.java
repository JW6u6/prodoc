package com.prodoc.history.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.history.mapper.HistoryMapper;
import com.prodoc.history.service.HisSearchVO;
import com.prodoc.history.service.HistoryService;
import com.prodoc.history.service.HistoryVO;

@Service
public class HistoryServiceImpl implements HistoryService {
	@Autowired
	HistoryMapper mapper;
	@Override
	public List<HistoryVO> getHistory(HisSearchVO search) {
		return mapper.selectList(search);
	}

}
