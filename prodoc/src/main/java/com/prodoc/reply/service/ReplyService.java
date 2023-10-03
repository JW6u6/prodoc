package com.prodoc.reply.service;

import java.util.List;

public interface ReplyService {
	public List<ReplyVO> selectBlockReply(ReplyVO replyVO);
	public List<ReplyVO> selectPageReply(ReplyVO replyVO);
	public int createComment(ReplyVO replyVO);
	public int editComment(ReplyVO replyVO);
	public int deleteComment(ReplyVO replyVO);
}
