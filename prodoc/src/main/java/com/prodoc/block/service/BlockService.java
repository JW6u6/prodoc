package com.prodoc.block.service;

import java.util.List;

public interface BlockService {
	public List<BlockVO> selectAllBlock(BlockVO blockVO);
	public int createBlock(BlockVO blockVO);
	public int updateBlock(BlockVO blockVO);
	public int deleteBlock(BlockVO blockVO);
}
