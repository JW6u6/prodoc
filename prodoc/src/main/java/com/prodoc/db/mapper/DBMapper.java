package com.prodoc.db.mapper;

import java.util.List;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.service.DBCaseVO;

public interface DBMapper {
	public void insertDBCase(DBCaseVO page);
	public List<BlockVO> getDBPageList(String casePageId);
}
