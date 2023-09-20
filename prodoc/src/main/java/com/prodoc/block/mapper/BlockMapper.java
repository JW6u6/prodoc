package com.prodoc.block.mapper;

import java.util.List;
import java.util.Map;

import com.prodoc.block.service.BlockVO;

public interface BlockMapper {
	public List<BlockVO> selectAllBlock(BlockVO blockVO);
	public int insertBlock(BlockVO blockVO);
	public int updateBlock(BlockVO blockVO);
	public int deleteBlock(BlockVO blockVO);
	public int createCheckBlock(Map<String,String> hashMap);
}
