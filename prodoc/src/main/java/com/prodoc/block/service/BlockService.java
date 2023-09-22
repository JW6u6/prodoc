package com.prodoc.block.service;

import java.util.List;
import java.util.Map;

public interface BlockService {
	public List<BlockVO> selectAllBlock(BlockVO blockVO);
	public BlockVO selectBlock(BlockVO blockVO);
	public int createBlock(BlockVO blockVO);
	public int updateBlock(BlockVO blockVO);
	public int deleteBlock(BlockVO blockVO);
	public int createBookMark(BookMarkVO vo);
	public int updateBookMark(BookMarkVO vo);
	public BookMarkVO getBookMark(BookMarkVO vo);
}
