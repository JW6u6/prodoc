package com.prodoc.user.service;

public interface UserService {
	public UserVO getUser(UserVO user); //특정(단일) 유저 검색 *회원가입 이메일 유무
	public int join(UserVO user); 		//이메일 회원가입
	public int joinOut(UserVO user);	//탈퇴
}
