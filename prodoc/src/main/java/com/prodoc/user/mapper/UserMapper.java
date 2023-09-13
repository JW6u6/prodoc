package com.prodoc.user.mapper;

import com.prodoc.user.service.UserVO;

public interface UserMapper {
	public UserVO selectUser(UserVO user); //특정(단일) 유저 검색
}
