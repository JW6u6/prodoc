package com.prodoc.block.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.block.mapper.BlockMapper;
import com.prodoc.block.service.BlockService;
import com.prodoc.block.service.BlockVO;

@Service
public class BlockServiceImpl implements BlockService {

	@Autowired
	BlockMapper blockmapper;
	
	@Override
	public List<BlockVO> selectAllBlock(BlockVO blockVO) {
		// TODO Auto-generated method stub
		return blockmapper.selectAllBlock(blockVO);
	}

	@Override
	public int createBlock(BlockVO blockVO) {
		// TODO Auto-generated method stub
		return blockmapper.insertBlock(blockVO);
	}

	@Override
	public int updateBlock(BlockVO blockVO) {
		// TODO Auto-generated method stub
		return blockmapper.updateBlock(blockVO);
	}

	@Override
	public int deleteBlock(BlockVO blockVO) {
		// TODO Auto-generated method stub
		return blockmapper.deleteBlock(blockVO);
	}

}
