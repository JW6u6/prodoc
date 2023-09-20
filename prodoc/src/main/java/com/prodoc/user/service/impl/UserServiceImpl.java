package com.prodoc.user.service.impl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    //@Autowired
   // private AuthenticationManager authenticationManager; // 얘를 통해 세션값 변경해야함

	@Override
	public UserVO getUser(UserVO user) {	//로그인 OR 기존 메일 찾기
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

	@Override
	@Transactional
	public String modifyInfo(UserVO user, HttpServletRequest request) {
		if(!user.getPassword().equals(""))	//비밀번호 변경이 있음 -> 암호화 진행
			user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		ObjectMapper objectMapper = new ObjectMapper();
		String json = "";
		try {
			json = objectMapper.writeValueAsString(user);
			System.out.println(json);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		if(	mapper.updateUser(user) > 0 ){	//업데이트 진행
			HttpSession session = request.getSession();
			session.setAttribute("logUser", mapper.selectUser(user));	//세션 재등록
			return "{\"result\":true, \"data\" : "+ json +"}";
		}
		return "{\"result\":false}";
	}

}
