package com.prodoc.block.service.impl;

import java.util.List;
import java.util.Map;

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
		blockmapper.deleteBookMark(blockVO.getDisplayId());
		return blockmapper.deleteBlock(blockVO);
	}

	@Override
	public int createCheckBlock(Map<String,String> hashMap) {
		// TODO Auto-generated method stub
		return blockmapper.createCheckBlock(hashMap);
	}

	@Override
	public int createBookMark(String display_id) {
		// TODO Auto-generated method stub
		return blockmapper.createBookMark(display_id);
	}

	@Override
	public int updateBookMark(Map<String, String> map) {
		// TODO Auto-generated method stub
		return blockmapper.updateBookMark(map);
	}

	@Override
	public String getBookMark(String displayId) {
		// TODO Auto-generated method stub
		return blockmapper.getBookMark(displayId);
	}

	@Override
	public int deleteBookMark(String displayId) {
		// TODO Auto-generated method stub
		return blockmapper.deleteBookMark(displayId);
	}

}
