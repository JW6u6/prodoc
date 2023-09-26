package com.prodoc.member.service;

import java.util.List;

public interface MemberService {
	
	//멤버 권한 변경
	public int renewAuthMember(List<MemberVO> memberVO);
	
	//멤버 내보내기
	public int deleteMember(List<MemberVO> memberVO);
	
	//멤버 조회
	public List<MemberVO> listMember(MemberVO memberVO);
}