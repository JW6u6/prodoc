package com.prodoc.member.service;

public interface MemberService {
	
	public boolean renewAuthMember(MemberVO memberVO);
	
	public boolean deleteMember(MemberVO memberVO);
}
