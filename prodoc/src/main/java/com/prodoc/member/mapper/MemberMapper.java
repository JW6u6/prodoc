package com.prodoc.member.mapper;

import java.util.List;

import com.prodoc.member.service.MemberVO;

public interface MemberMapper {
	
	// 멤버 권한 변경
	public int renewAUTH(MemberVO memberVO);
	
	// 멤버 내보내기(삭제)
	public int removeMember(MemberVO memberVO);
	
	//멤버 조회
	public List<MemberVO> listMember(String workId);
	
	//탈퇴
	public int myAuth(String email);
}
