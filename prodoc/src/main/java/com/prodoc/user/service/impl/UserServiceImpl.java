package com.prodoc.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.user.mapper.UserMapper;
import com.prodoc.user.service.UserService;
import com.prodoc.user.service.UserVO;

@Service
public class UserServiceImpl implements UserService {
	@Autowired
	UserMapper mapper;
	
	@Override
	public UserVO getUser(UserVO user) {
		return mapper.selectUser(user);
	}

}
