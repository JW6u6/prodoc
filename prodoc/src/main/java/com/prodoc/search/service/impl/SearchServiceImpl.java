package com.prodoc.search.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.search.mapper.SearchMapper;
import com.prodoc.search.service.ResultVO;
import com.prodoc.search.service.SearchService;
import com.prodoc.search.service.SearchVO;

@Service
public class SearchServiceImpl implements SearchService {
	@Autowired
	SearchMapper mapper;
	
	@Override
	public List<ResultVO> searchBlock(SearchVO search) {
		return mapper.selectblockList(search);
	}

	@Override
	public List<ResultVO> searchDB(SearchVO search) {
		return mapper.selectDBList(search);
	}

}
