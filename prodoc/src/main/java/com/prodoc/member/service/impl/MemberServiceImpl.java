package com.prodoc.member.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

	//멤버 내보내기
	@Override
	public int deleteMember(List<MemberVO> listVO) {
		for(MemberVO memberVO : listVO) {
			memberMapper.removeMember(memberVO);
		}
		return listVO.size();
	}

	@Override
	public List<MemberVO> listMember(String workId) {
		return memberMapper.listMember(workId);
	}

}