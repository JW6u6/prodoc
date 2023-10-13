package com.prodoc.file.mapper;

import java.util.List;

import com.prodoc.db.service.PageAttrVO;
import com.prodoc.file.service.KeywordVO;
import com.prodoc.file.service.SelectFileVO;

public interface FileSearchMapper {
	public List<SelectFileVO> getFileList(KeywordVO vo);	//전체 조회
	public PageAttrVO fileDownload(String id);
}
