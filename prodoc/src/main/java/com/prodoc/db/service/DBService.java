package com.prodoc.db.service;

import java.util.List;

public interface DBService {
	public String insertDBCase(DBCaseVO vo);
	public List<DBPageVO> getDBPageList(String casePage);
}
