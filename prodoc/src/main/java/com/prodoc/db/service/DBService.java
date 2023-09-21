package com.prodoc.db.service;

import java.util.List;

import com.prodoc.block.service.BlockVO;

public interface DBService {
	public String insertDBCase(DBCaseVO vo);
	public List<BlockVO> getDBPageList(String casePage);
}
