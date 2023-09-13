package com.prodoc.user.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.prodoc.user.service.UserService;
import com.prodoc.user.service.UserVO;


@Controller
public class LoginController {
	@Autowired
	UserService service;
	
	@RequestMapping(value = "/", method=RequestMethod.GET)
	public String goMain(HttpServletRequest request) {
		return "login";
	}
	
	@PostMapping("/login")
	public String loginProcess(UserVO user, HttpServletRequest request, Model model) {
		UserVO logUser = service.getUser(user);
		if(logUser == null) {
			model.addAttribute("fail", "로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.");
		}
		//로그인 성공
		HttpSession session = request.getSession();
		session.setAttribute("logUser", logUser);
		System.out.println(logUser);
		return "";
	}
}
