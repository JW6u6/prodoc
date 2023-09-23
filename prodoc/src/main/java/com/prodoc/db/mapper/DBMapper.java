package com.prodoc.db.mapper;

import java.util.List;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBdataVO;
import com.prodoc.db.service.PageAttrVO;
import com.prodoc.page.service.PageVO;

public interface DBMapper {
	public void insertDBCase(DBCaseVO page);				// DBcase가 되는 페이지 insert
	public List<BlockVO> getDBPageList(String caseBlockId);	// DBcase 블럭아이디로 하위 DBpage블럭 select
	public PageVO getDBPageInfo(String displayId);			// 블럭아이디로 DB페이지 정보 select
	public List<PageAttrVO> getPageAttr(String displayId);	// DB페이지의 속성 select
	public int updateCase(PageVO vo);			// DB 레이아웃 변경시 case_id 변경
	public int insertDBPage(DBdataVO vo);		// DBcase 하위에 DB페이지 생성
	
}
