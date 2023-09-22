package com.prodoc.search.service;

import java.util.List;

public interface SearchService {
	public List<ResultVO> searchBlock(SearchVO search);
	public List<ResultVO> searchDB(SearchVO search);
}
