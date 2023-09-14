package com.prodoc.user.service;

public interface UserService {
	public UserVO getUser(UserVO user); //특정(단일) 유저 검색
	public int join(UserVO user); //이메일 회원가입
}
