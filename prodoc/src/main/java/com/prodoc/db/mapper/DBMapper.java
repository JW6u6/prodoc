package com.prodoc.db.mapper;

import java.util.List;

import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBPageVO;

public interface DBMapper {
	public void insertDBCase(DBCaseVO page);
	public List<DBPageVO> getDBPageList(String casePageId);
}
