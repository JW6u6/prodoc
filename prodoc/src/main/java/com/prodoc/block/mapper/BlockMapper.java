package com.prodoc.block.mapper;

import java.util.List;

import com.prodoc.block.service.BlockVO;

public interface BlockMapper {
	public List<BlockVO> selectAllBlock(BlockVO blockvo);
}
