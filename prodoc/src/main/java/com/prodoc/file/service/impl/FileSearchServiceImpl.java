package com.prodoc.file.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.db.service.PageAttrVO;
import com.prodoc.file.mapper.FileSearchMapper;
import com.prodoc.file.service.FileSearchService;
import com.prodoc.file.service.KeywordVO;
import com.prodoc.file.service.SelectFileVO;

@Service
public class FileSearchServiceImpl implements FileSearchService {
	
	@Autowired
	FileSearchMapper mapper;

	@Override
	public List<SelectFileVO> getFileList(KeywordVO vo) {
		return mapper.getFileList(vo);
	}

	@Override
	public PageAttrVO fileDownload(String id) {
		return mapper.fileDownload(id);
	}
}
