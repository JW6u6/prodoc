package com.prodoc.user.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.prodoc.member.service.MemberService;
import com.prodoc.user.service.UserService;
import com.prodoc.user.service.UserVO;

@Controller
public class UserController {
	@Autowired
	UserService service;
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@ResponseBody
	@PostMapping("/joinout")
	public String goMain(@RequestBody UserVO pw, HttpServletRequest request) {
		UserVO vo = (UserVO)request.getSession().getAttribute("logUser");
		System.out.println("vo pw: " + vo.getPassword());
		System.out.println("pw: " + pw.getPassword());
		System.out.println("matches: " + passwordEncoder.matches(pw.getPassword(), vo.getPassword()));
		if(passwordEncoder.matches(pw.getPassword(), vo.getPassword())) {
			if(service.joinOut(vo) > 0) { //탈퇴 서비스
				return "{\"result\":true}";
			}else return "{\"result\":false, \"msg\" : \"팀 워크스페이스 소유자 권한을 양도해야 합니다.\"}";
		}
		else return "{\"result\":false, \"msg\" : \"비밀번호가 일치하지 않습니다.\"}";
	}
}
