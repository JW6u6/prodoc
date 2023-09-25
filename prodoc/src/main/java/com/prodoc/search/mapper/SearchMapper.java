package com.prodoc.search.mapper;

import java.util.List;

import com.prodoc.search.service.ResultVO;
import com.prodoc.search.service.SearchVO;

public interface SearchMapper {
	public List<ResultVO> selectblockList(SearchVO search);
	public List<ResultVO> selectDBList(SearchVO search);
}
