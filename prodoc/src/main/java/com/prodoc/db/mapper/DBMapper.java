package com.prodoc.db.mapper;

import java.util.List;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.PageAttrVO;
import com.prodoc.page.service.PageVO;

public interface DBMapper {
	public void insertDBCase(DBCaseVO page);
	public List<BlockVO> getDBPageList(String casePageId);	//매개변수 PageVO로 바꾸기(case같이 가져와야함)
	public PageVO getDBPageInfo(String displayId);
	public List<PageAttrVO> getPageAttr(String displayId);
}
