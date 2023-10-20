package com.prodoc.user.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface UserService {
	public UserVO getUser(UserVO user); //특정(단일) 유저 검색 *default 조건: email
	public List<String> getFind(UserVO user); //특정(단일) 유저 검색 *default 조건: phone
	public int join(UserVO user); 		//이메일 회원가입
	public int joinOut(UserVO user);	//탈퇴
	public String modifyInfo(UserVO user, HttpServletRequest request); //유저 정보 수정
}
