package com.prodoc.db.service;

import java.util.List;

import com.prodoc.file.service.FileVO;

public interface DBAttrService {
	public String insertAttr(AddAttrVO vo);
	public List<PageAttrVO> getPageAttr(String displayId);
	public List<AttrVO> pageAttrList();
	public List<PageAttrVO> getAllPageAttr(String parentId);
	public int updateDbAttr(PageAttrVO vo);
	public void deletePageAttr(String dbUseId);
	public int addCalendar(PageAttrVO vo);
	public List<PageAttrVO> selectAllTags(String dbUseId);
	
	public int updateAttrContent(PageAttrVO vo);
	public String insertAttrContent(PageAttrVO vo);
	public int deleteAttrContent(String pageUseId);
	
	public int insertFileAttr(String displayId);
	public int updateFileAttr(FileVO file);
	public int deleteFileAttr(String displayId);
	public FileVO selectFileAttr(String displayId);
}
