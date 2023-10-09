package com.prodoc.db.mapper;

import java.util.List;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.service.DBBlockVO;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBdataVO;
import com.prodoc.page.service.PageVO;
import com.prodoc.user.service.UserVO;

public interface DBMapper {
	public void insertDBCase(DBCaseVO page);				// DBcase가 되는 페이지 insert
	public List<BlockVO> getDBPageList(String caseBlockId);	// DBcase 블럭아이디로 하위 DBpage블럭 select
	public PageVO getDBPageInfo(String displayId);			// 블럭아이디로 DB페이지 정보 select
	public int updateCase(PageVO vo);			// DB 레이아웃 변경시 case_id 변경
	public void insertDBPage(DBdataVO vo);		// DBcase 하위에 DB페이지 생성	
	public int deleteDBPage(BlockVO vo);
	public DBBlockVO getDBblock(DBBlockVO vo);
	public List<UserVO> getWorkMembers(String pageId);
	
	public PageVO getPageInfo(String pageId);	// 페이지VO 따로 필요해서 만들었음
}
