package com.prodoc.user.mapper;

import com.prodoc.user.service.UserVO;

public interface UserMapper {
	public UserVO selectUser(UserVO user); 	//특정(단일) 유저 검색 - 로그인
	public int insertUser(UserVO user); 	//회원가입
	public int deleteUser(UserVO user);		//탈퇴
	public int updateUser(UserVO user);		//수정
}
