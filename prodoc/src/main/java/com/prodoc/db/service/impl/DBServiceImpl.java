package com.prodoc.db.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.mapper.DBMapper;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBService;
import com.prodoc.db.service.DBdataVO;
import com.prodoc.db.service.PageAttrVO;
import com.prodoc.page.service.PageVO;

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
	public List<PageAttrVO> getPageAttr(String displayId) {
		return mapper.getPageAttr(displayId);
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
	public List<PageAttrVO> getAllPageAttr(String parentId) {
		return mapper.getAllPageAttr(parentId);
	}

}
