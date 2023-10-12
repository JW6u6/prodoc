package com.prodoc.db.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.db.mapper.DBAttrMapper;
import com.prodoc.db.service.AddAttrVO;
import com.prodoc.db.service.AttrVO;
import com.prodoc.db.service.DBAttrService;
import com.prodoc.db.service.PageAttrVO;
import com.prodoc.file.service.FileVO;

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

	@Override
	public void deletePageAttr(PageAttrVO attrvo) {
		mapper.deletePageAttr(attrvo);
	}

	@Override
	public int addCalendar(PageAttrVO vo) {
		return mapper.addCalendar(vo);
	}

	@Override
	public int updateAttrContent(PageAttrVO vo) {
		return mapper.updateAttrContent(vo);
	}

	@Override
	public String insertAttrContent(PageAttrVO vo) {
		mapper.insertAttrContent(vo);
		return vo.getPageUseId();
	}

	@Override
	public void deleteAttrContent(PageAttrVO vo) {
		mapper.deleteAttrContent(vo);
	}

	@Override
	public List<PageAttrVO> selectAllTags(String dbUseId) {
		return mapper.selectAllTags(dbUseId);
	}

	@Override
	public void modifyAttrName(PageAttrVO vo) {
		mapper.modifyAttrName(vo);
	}

	@Override
	public void modifyDBPage(PageAttrVO vo) {
		mapper.modifyDBPage(vo);
	}

	@Override
	public int attrNumberUpdate(PageAttrVO vo) {
		return mapper.attrNumberUpdate(vo);
	}

	@Override
	public List<PageAttrVO> addAttridSelect(PageAttrVO vo) {
		return mapper.addAttridSelect(vo);
	}

}
