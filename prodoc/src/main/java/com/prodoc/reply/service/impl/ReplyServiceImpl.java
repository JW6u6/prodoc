package com.prodoc.reply.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.reply.mapper.ReplyMapper;
import com.prodoc.reply.service.ReplyService;
import com.prodoc.reply.service.ReplyVO;

@Service
public class ReplyServiceImpl implements ReplyService {

	@Autowired
	ReplyMapper mapper;
	
	@Override
	public List<ReplyVO> selectBlockReply(ReplyVO replyVO) {
		// TODO Auto-generated method stub
		return mapper.selectBlockReply(replyVO);
	}

	@Override
	public List<ReplyVO> selectPageReply(ReplyVO replyVO) {
		// TODO Auto-generated method stub
		return mapper.selectPageReply(replyVO);
	}

	@Override
	public int createComment(ReplyVO replyVO) {
		// TODO Auto-generated method stub
		return mapper.createComment(replyVO);
	}

	@Override
	public int editComment(ReplyVO replyVO) {
		// TODO Auto-generated method stub
		return mapper.editComment(replyVO);
	}

	@Override
	public int deleteComment(ReplyVO replyVO) {
		// TODO Auto-generated method stub
		return mapper.deleteComment(replyVO);
	}

}
