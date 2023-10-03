package com.prodoc.reply.mapper;

import java.util.List;

import com.prodoc.reply.service.ReplyVO;

public interface ReplyMapper {
	public List<ReplyVO> selectBlockReply(ReplyVO replyVO);
	public List<ReplyVO> selectPageReply(ReplyVO replyVO);
	public int createComment(ReplyVO replyVO);
	public int editComment(ReplyVO replyVO);
	public int deleteComment(ReplyVO replyVO);
}
