package com.prodoc.db.mapper;

import java.util.List;

import com.prodoc.db.service.AddAttrVO;
import com.prodoc.db.service.AttrVO;
import com.prodoc.db.service.PageAttrVO;
import com.prodoc.file.service.FileVO;

public interface DBAttrMapper {
	public void insertPageAttr(AddAttrVO vo);		// DB에 attr 추가
	public List<PageAttrVO> getPageAttr(String displayId);	// DB페이지의 속성 select
	public List<AttrVO> pageAttrList();			// 모든 기본 속성 조회
	public List<PageAttrVO> getAllPageAttr(String parentId);	// DBcase 하위 페이지의 모든 속성 select
	public int updateDbAttr(PageAttrVO vo);					// DB 속성 디스플레이 설정
	public void deletePageAttr(String dbUseId);	// DB 속성 삭제
	public int addCalendar(PageAttrVO vo);		// 캘린더 등록
	public List<PageAttrVO> selectAllTags(String dbUseId);	// DB TAG리스트
	
	public int updateAttrContent(PageAttrVO vo);
	public void insertAttrContent(PageAttrVO vo);
	public int deleteAttrContent(String pageUseId);
	
	public int insertFileAttr(String displayId);
	public int updateFileAttr(FileVO file);
	public int deleteFileAttr(String displayId);
	public FileVO selectFileAttr(String displayId);
}
