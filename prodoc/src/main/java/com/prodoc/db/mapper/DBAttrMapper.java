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
	public void deletePageAttr(PageAttrVO attrvo);	// DB 속성 삭제
	public int addCalendar(PageAttrVO vo);		// 캘린더 등록
	public List<PageAttrVO> selectAllTags(String dbUseId);	// DB TAG리스트
	public void modifyAttrName(PageAttrVO vo);	//속성이름수정
	public void modifyDBPage(PageAttrVO vo);	//DB하위페이지 수정시 히스토리, 속성 업데이트
	public int attrNumberUpdate(PageAttrVO vo);	//속성넘버링 변겅
	
	public int updateAttrContent(PageAttrVO vo);
	public void insertAttrContent(PageAttrVO vo);
	public void deleteAttrContent(PageAttrVO vo);
}
