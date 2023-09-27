package com.prodoc.db.service;

import java.util.List;

import com.prodoc.block.service.BlockVO;
import com.prodoc.page.service.PageVO;

public interface DBService {
	public String insertDBCase(DBCaseVO vo);
	public List<BlockVO> getDBPageList(String casePage);
	public PageVO getDBPageInfo(String displayId);
	public int updateCase(PageVO vo);
	public String insertDBPage(DBdataVO vo);
	public int deleteDBPage(String pageId);
}
