package com.prodoc.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prodoc.member.mapper.MemberMapper;
import com.prodoc.user.mapper.UserMapper;
import com.prodoc.user.service.UserService;
import com.prodoc.user.service.UserVO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService, UserDetailsService{
	@Autowired
	UserMapper mapper;
	@Autowired
	MemberMapper mMapper;
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Override
	public UserVO getUser(UserVO user) {	//로그인
		return mapper.selectUser(user);	
	}

	@Override
	public int join(UserVO user) {		//비밀번호 암호화 진행 후 insert
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		log.info(user.toString());
 		return mapper.insertUser(user);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserVO check = new UserVO();
		check.setEmail(username);
		check = mapper.selectUser(check);
		if(check == null) {
			throw new UsernameNotFoundException("NO_USER");
		}
		return check;
	}

	@Override
	@Transactional
	public int joinOut(UserVO user) {	//탈퇴
		if( mMapper.myAuth(user.getEmail()) > 0){
			//내가 가진 팀 워크스페이스가 있을 시 실패
			return 0;
		}
		return mapper.deleteUser(user);
	}

}
