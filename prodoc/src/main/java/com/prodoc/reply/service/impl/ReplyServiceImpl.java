package com.prodoc.reply.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.notify.service.NotifyService;
import com.prodoc.notify.service.NotifyVO;
import com.prodoc.reply.mapper.ReplyMapper;
import com.prodoc.reply.service.ReplyService;
import com.prodoc.reply.service.ReplyVO;

@Service
public class ReplyServiceImpl implements ReplyService {

	@Autowired
	ReplyMapper mapper;
	
	@Autowired
	NotifyService notifyService;
	
	@Override
	public List<ReplyVO> selectBlockReply(ReplyVO replyVO) {
		
		return mapper.selectBlockReply(replyVO);
	}

	@Override
	public List<ReplyVO> selectPageReply(ReplyVO replyVO) {
		// TODO Auto-generated method stub
		return mapper.selectPageReply(replyVO);
	}

	@Override
	public int createComment(ReplyVO replyVO) {
		NotifyVO notify = new NotifyVO();
		notify.setDisplayId(replyVO.getDisplayId());
		notify.setNoteType("REPLY_TG");
		notify.setCreUser(replyVO.getCreUser());
		notify.setPageId(replyVO.getPageId());
		notify.setReplyId(replyVO.getReplyId());
		notifyService.insertTargetNotify(notify);
		System.out.println(replyVO.toString());
		System.out.println(notify.toString());
		return mapper.createComment(replyVO);
	}

	@Override
	public int editComment(ReplyVO replyVO) {
		
		return mapper.editComment(replyVO);
	}

	@Override
	public int deleteComment(ReplyVO replyVO) {
		// TODO Auto-generated method stub
		return mapper.deleteComment(replyVO);
	}

}
