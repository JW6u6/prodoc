package com.prodoc.history.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.block.service.BlockVO;
import com.prodoc.history.mapper.HistoryMapper;
import com.prodoc.history.service.HisSearchVO;
import com.prodoc.history.service.HistoryService;
import com.prodoc.history.service.HistoryVO;
import com.prodoc.history.service.RevokeVO;

@Service
public class HistoryServiceImpl implements HistoryService {
	@Autowired
	HistoryMapper mapper;
	
	@Override
	public List<HistoryVO> getHistory(HisSearchVO search) {
		return mapper.selectList(search);
	}
	
	@Override
	public void blockHistory(BlockVO block) {
		mapper.blockHistory(block);
	}
	
	@Override
	public int insertHistory(HistoryVO history) {
		return mapper.insertHistory(history);
	}
	
	@Override
	public RevokeVO revokePage(RevokeVO revoke) {
		mapper.revokePage(revoke);
		return revoke;
	}
	
	@Override
	public RevokeVO revokeWork(RevokeVO revoke) {	
		mapper.revokeWork(revoke);
		return revoke;
	}

}
