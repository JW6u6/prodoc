package com.prodoc.db.service;

import java.util.List;

import com.prodoc.block.service.BlockVO;
import com.prodoc.page.service.PageVO;
import com.prodoc.user.service.UserVO;

public interface DBService {
	public String insertDBCase(DBCaseVO vo);
	public List<BlockVO> getDBPageList(String casePage);
	public PageVO getDBPageInfo(String displayId);
	public int updateCase(PageVO vo);
	public String insertDBPage(DBdataVO vo);
	public int deleteDBPage(BlockVO vo);
	public DBBlockVO getDBblock(DBBlockVO vo);
	public List<UserVO> getWorkMembers(String pageId);
	public List<BlockVO> databaseSearch(PageAttrVO attrVO);
	
	public void databaseUpdate(PageAttrVO vo);
	public void dbpageNumbering(PageAttrVO vo);
	
	public PageVO getPageInfo(String PageId);
	
	// 페이지 호출시 페이지 타입을 조회
	public String pageTypeCheck(PageVO pageVO);
	public DBBlockVO getDatabaseInfo(String pageId);
}
