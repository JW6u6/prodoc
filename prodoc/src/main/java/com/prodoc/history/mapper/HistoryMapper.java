package com.prodoc.history.mapper;

import java.util.List;

import com.prodoc.block.service.BlockVO;
import com.prodoc.history.service.HisSearchVO;
import com.prodoc.history.service.HistoryVO;
import com.prodoc.history.service.RevokeVO;

public interface HistoryMapper {
	public List<HistoryVO> selectList(HisSearchVO search);	//히스토리 목록
	public void blockHistory(BlockVO block);	//블럭(생성,수정,삭제 => 페이지 수정)
	public int insertHistory(HistoryVO historyVO);	//페이지(생성/삭제), 워크(생성,수정,삭제)
	public RevokeVO revokePage(RevokeVO revoke);		//페이지 복구
	public RevokeVO revokeWork(RevokeVO revoke);		//워크 복구
}
