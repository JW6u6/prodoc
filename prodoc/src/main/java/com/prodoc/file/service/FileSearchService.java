package com.prodoc.file.service;

import java.util.List;

import com.prodoc.db.service.PageAttrVO;

public interface FileSearchService {
	public List<SelectFileVO> getFileList(KeywordVO vo);			// 전체 조회
	public PageAttrVO fileDownload(String id);
}
