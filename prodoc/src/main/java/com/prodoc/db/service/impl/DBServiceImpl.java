package com.prodoc.db.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.mapper.DBMapper;
import com.prodoc.db.service.DBBlockVO;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBService;
import com.prodoc.db.service.DBdataVO;
import com.prodoc.db.service.PageAttrVO;
import com.prodoc.page.service.PageVO;
import com.prodoc.user.service.UserVO;

@Service
public class DBServiceImpl implements DBService {
	@Autowired
	DBMapper mapper;

	@Override
	public String insertDBCase(DBCaseVO vo) {
		mapper.insertDBCase(vo);
		return vo.getResult();
	}

	@Override
	public List<BlockVO> getDBPageList(String casePage) {
		return mapper.getDBPageList(casePage);
	}

	@Override
	public PageVO getDBPageInfo(String displayId) {
		return mapper.getDBPageInfo(displayId);
	}

	@Override
	public int updateCase(PageVO vo) {
		return mapper.updateCase(vo);
	}

	@Override
	public String insertDBPage(DBdataVO vo) {
		mapper.insertDBPage(vo);
		return vo.getResult();
	}

	@Override
	public int deleteDBPage(BlockVO vo) {
		return mapper.deleteDBPage(vo);
	}

	@Override
	public DBBlockVO getDBblock(DBBlockVO vo) {
		return mapper.getDBblock(vo);
	}

	@Override
	public PageVO getPageInfo(String PageId) {
		return mapper.getPageInfo(PageId);
	}

	@Override
	public List<UserVO> getWorkMembers(String pageId) {
		return mapper.getWorkMembers(pageId);
	}

	@Override
	public void databaseUpdate(PageAttrVO vo) {
		mapper.databaseUpdate(vo);
	}

	@Override
	public void dbpageNumbering(PageAttrVO vo) {
		mapper.dbpageNumbering(vo);
	}

	@Override
	public String pageTypeCheck(PageVO pageVO) {
		mapper.pageTypeCheck(pageVO);
		return pageVO.getCaseId();
	}

	@Override
	public DBBlockVO getDatabaseInfo(String pageId) {
		return mapper.getDatabaseInfo(pageId);
	}

	@Override
	public List<BlockVO> databaseSearch(PageAttrVO attrVO) {
		return mapper.databaseSearch(attrVO); 
	}



}
