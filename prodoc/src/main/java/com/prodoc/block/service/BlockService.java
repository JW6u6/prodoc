package com.prodoc.block.service;

import java.util.List;
import java.util.Map;

public interface BlockService {
	public List<BlockVO> selectAllBlock(BlockVO blockVO);
	public int createBlock(BlockVO blockVO);
	public int updateBlock(BlockVO blockVO);
	public int deleteBlock(BlockVO blockVO);
	public int createCheckBlock(Map<String,String> hashMap);
	public int createBookMark(String display_id);
	public int updateBookMark(Map<String,String> map);
	public String getBookMark(String displayId);
	public int deleteBookMark(String displayId);
}
