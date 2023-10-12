package com.prodoc.history.service;

import java.util.List;

import com.prodoc.block.service.BlockVO;

public interface HistoryService {
	public List<HistoryVO> getHistory(HisSearchVO search);	//히스토리 목록
	public void blockHistory(BlockVO block);	//페이지 수정
	public int insertHistory(HistoryVO history);	//페이지-워크 생성수정삭제
	public RevokeVO revokePage(RevokeVO revoke);	//페이지 복구
	public RevokeVO revokeWork(RevokeVO revoke);//워크 복구
}
