package com.prodoc.user.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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
	
	@ResponseBody
	@PostMapping("/login")
	public String loginProcess(@RequestBody UserVO user, HttpServletRequest request) {
		UserVO logUser = service.getUser(user);
		if(logUser != null) {
			//로그인 성공
			HttpSession session = request.getSession();
			session.setAttribute("logUser", logUser);
			return "true";
		}
		return "false";
	}
}
