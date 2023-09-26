package com.prodoc.db.mapper;

import java.util.List;

import com.prodoc.db.service.AddAttrVO;
import com.prodoc.db.service.AttrVO;
import com.prodoc.db.service.PageAttrVO;

public interface DBAttrMapper {
	public void insertPageAttr(AddAttrVO vo);		// DB에 attr 추가
	public List<PageAttrVO> getPageAttr(String displayId);	// DB페이지의 속성 select
	public List<AttrVO> pageAttrList();			// 모든 기본 속성 조회
	public List<PageAttrVO> getAllPageAttr(String parentId);	// DBcase 하위 페이지의 모든 속성 select
	public int updateDbAttr(PageAttrVO vo);					// DB 속성 디스플레이 설정
}
