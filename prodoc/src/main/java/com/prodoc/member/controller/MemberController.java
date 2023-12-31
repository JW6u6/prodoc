package com.prodoc.member.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.member.service.MemberService;
import com.prodoc.member.service.MemberVO;

import lombok.Setter;

@RestController
public class MemberController {

	@Setter(onMethod_ = @Autowired)
	MemberService memberService;

	@GetMapping("/memberList")
	public List<MemberVO> getMemberList(MemberVO memberVO) {
		return memberService.listMember(memberVO);
	}

	// 멤버 내보내기
	@PostMapping("/memberDelete")
	public int membersDelete(@RequestBody List<MemberVO> memberVO) {
		return memberService.deleteMember(memberVO);
	}

	// 멤버 권한 설정
	@PostMapping("/memberRenewAuth")
	public int memberReAuth(@RequestBody List<MemberVO> memberVO) {
		return memberService.renewAuthMember(memberVO);
	}

}