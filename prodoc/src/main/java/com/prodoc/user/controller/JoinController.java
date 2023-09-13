package com.prodoc.user.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class JoinController {
	@GetMapping("/join")
	public String JoinForm(HttpServletRequest request) {
		return "joinForm";
	}
	
	@PostMapping("/join")
	public String JoinProcess(HttpServletRequest request) {
		//회원가입
		return "redirect:login";
	}
}
