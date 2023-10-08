package com.prodoc.db.service;

import java.util.List;

public interface DBAttrService {
	public String insertAttr(AddAttrVO vo);
	public List<PageAttrVO> getPageAttr(String displayId);
	public List<AttrVO> pageAttrList();
	public List<PageAttrVO> getAllPageAttr(String parentId);
	public int updateDbAttr(PageAttrVO vo);
	public void deletePageAttr(PageAttrVO attrvo);
	public int addCalendar(PageAttrVO vo);
	public List<PageAttrVO> selectAllTags(String dbUseId);
	public void modifyAttrName(PageAttrVO vo);
	public void modifyDBPage(PageAttrVO vo);
	
	public int updateAttrContent(PageAttrVO vo);
	public String insertAttrContent(PageAttrVO vo);
	public int deleteAttrContent(String pageUseId);
}
