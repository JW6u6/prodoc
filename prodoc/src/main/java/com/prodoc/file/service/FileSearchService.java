package com.prodoc.file.service;

import java.util.List;

public interface FileSearchService {
	public List<SelectFileVO> getFileList(KeywordVO vo);			// 전체 조회
}
