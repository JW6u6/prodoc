package com.prodoc.member.service;

import java.util.List;

public interface MemberService {
	
	//멤버 권한 변경
	public boolean renewAuthMember(MemberVO memberVO);
	
	//멤버 내보내기
	public boolean deleteMember(MemberVO memberVO);
	
	//멤버 조회
	public List<MemberVO> listMember(MemberVO memberVO);
}
