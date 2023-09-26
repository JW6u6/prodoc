package com.prodoc.db.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.db.mapper.DBAttrMapper;
import com.prodoc.db.service.AddAttrVO;
import com.prodoc.db.service.AttrVO;
import com.prodoc.db.service.DBAttrService;
import com.prodoc.db.service.PageAttrVO;

@Service
public class DBAttrServiceImpl implements DBAttrService {
	@Autowired
	DBAttrMapper mapper;
	
	@Override
	public String insertAttr(AddAttrVO vo) {
		mapper.insertPageAttr(vo);
		String result = vo.getResult();
		return result;
	}
	
	@Override
	public List<PageAttrVO> getPageAttr(String displayId) {
		return mapper.getPageAttr(displayId);
	}
	
	@Override
	public List<PageAttrVO> getAllPageAttr(String parentId) {
		return mapper.getAllPageAttr(parentId);
	}

	@Override
	public int updateDbAttr(PageAttrVO vo) {
		return mapper.updateDbAttr(vo);
	}

	@Override
	public List<AttrVO> pageAttrList() {
		return mapper.pageAttrList();
	}

}
