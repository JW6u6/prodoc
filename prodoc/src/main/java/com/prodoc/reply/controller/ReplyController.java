package com.prodoc.reply.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.reply.service.ReplyService;
import com.prodoc.reply.service.ReplyVO;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
public class ReplyController {
	
	@Autowired
	ReplyService service;
	
	@GetMapping("/reply/block")
	public List<ReplyVO> blockReplyList(@RequestParam String displayId){
		ReplyVO vo = new ReplyVO();
		vo.setDisplayId(displayId);
		return service.selectBlockReply(vo);
	}
	
	@GetMapping("/reply/page")
	public List<ReplyVO> pageReplyList(@RequestParam String pageId){
		ReplyVO vo = new ReplyVO();
		vo.setPageId(pageId);
		return service.selectPageReply(vo);
	}
	
	@PostMapping("/reply/regist")
	public String registReply(@RequestBody ReplyVO vo) {
		int result = service.createComment(vo);
		return "";
	}
	
	@PostMapping("/reply/edit")
	public String editReply(@RequestBody ReplyVO vo) {
		int result = service.editComment(vo);
		return "";
	}
	
	@PostMapping("/reply/delete")
	public String deleteReply(@RequestBody ReplyVO vo) {
		int result = service.deleteComment(vo);
		return "";
	}
}
