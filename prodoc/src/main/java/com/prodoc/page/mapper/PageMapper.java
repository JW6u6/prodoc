package com.prodoc.page.mapper;

import java.util.List;

import com.prodoc.page.service.PageVO;

public interface PageMapper {
	public List<PageVO> pageList(PageVO pageVO);
	
	public PageVO selectPageInfo(PageVO pageVO);
}
