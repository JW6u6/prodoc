package com.prodoc.member.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.member.service.MemberService;
import com.prodoc.member.service.MemberVO;

import lombok.Setter;

@RestController
public class MemberController {

	@Setter(onMethod_ = @Autowired)
	MemberService memberService;
	
	@GetMapping("/memberList")
	public List<MemberVO> getMemberList(String workId){
		return memberService.listMember(workId);
		
	}
}
