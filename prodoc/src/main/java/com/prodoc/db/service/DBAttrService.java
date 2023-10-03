package com.prodoc.db.service;

import java.util.List;

public interface DBAttrService {
	public String insertAttr(AddAttrVO vo);
	public List<PageAttrVO> getPageAttr(String displayId);
	public List<AttrVO> pageAttrList();
	public List<PageAttrVO> getAllPageAttr(String parentId);
	public int updateDbAttr(PageAttrVO vo);
	public void deletePageAttr(String dbUseId, String email);
	public int addCalendar(PageAttrVO vo);
	
	public int addAttrContent(PageAttrVO vo);
}
