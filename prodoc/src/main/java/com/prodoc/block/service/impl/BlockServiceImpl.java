package com.prodoc.block.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.block.mapper.BlockMapper;
import com.prodoc.block.service.BlockService;
import com.prodoc.block.service.BlockVO;
import com.prodoc.block.service.BookMarkVO;
import com.prodoc.file.service.FileVO;
import com.prodoc.reply.mapper.ReplyMapper;
import com.prodoc.reply.service.ReplyVO;

@Service
public class BlockServiceImpl implements BlockService {

	@Autowired
	BlockMapper blockmapper;
	
	@Autowired
	ReplyMapper replymapper;
	
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
		blockmapper.deleteFileBlock(blockVO.getDisplayId());
		blockmapper.deleteBookMark(blockVO.getDisplayId());
		
		
		BlockVO block = new BlockVO();
		block.setDisplayId(blockVO.getDisplayId());
		blockmapper.updateParentBlock(block);
		
		
		ReplyVO vo = new ReplyVO();
		vo.setDisplayId(blockVO.getDisplayId());
		replymapper.deleteComment(vo);
		return blockmapper.deleteBlock(blockVO);
	}


	@Override
	public int createBookMark(BookMarkVO vo) {
		// TODO Auto-generated method stub
		return blockmapper.createBookMark(vo);
	}

	@Override
	public int updateBookMark(BookMarkVO vo) {
		// TODO Auto-generated method stub
		return blockmapper.updateBookMark(vo);
	}

	@Override
	public BookMarkVO getBookMark(BookMarkVO vo) {
		// TODO Auto-generated method stub
		return blockmapper.getBookMark(vo);
	}

	@Override
	public BlockVO selectBlock(BlockVO blockVO) {
		// TODO Auto-generated method stub
		return blockmapper.selectBlock(blockVO);
	}

	@Override
	public FileVO getFile(String displayId) {
		// TODO Auto-generated method stub
		return blockmapper.getFile(displayId);
	}

	@Override
	public int insertFile(FileVO vo) {
		// TODO Auto-generated method stub
		return blockmapper.insertFile(vo);
	}



}
