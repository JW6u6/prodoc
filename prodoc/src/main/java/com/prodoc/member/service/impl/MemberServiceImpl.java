package com.prodoc.member.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.member.mapper.MemberMapper;
import com.prodoc.member.service.MemberService;
import com.prodoc.member.service.MemberVO;

import lombok.Setter;

@Service
public class MemberServiceImpl implements MemberService {

	@Setter(onMethod_ = @Autowired)
	MemberMapper memberMapper;
	
	@Override
	public boolean renewAuthMember(MemberVO memberVO) {
		return memberMapper.renewAUTH(memberVO) == 1;
	}

	@Override
	public boolean deleteMember(MemberVO memberVO) {
		return memberMapper.removeMember(memberVO) == 1;
	}

	@Override
	public List<MemberVO> listMember(String workId) {
		return memberMapper.listMember(workId);
	}
	
}
