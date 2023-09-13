package com.prodoc.user.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class JoinController {
	@GetMapping("/join")
	public String JoinForm(HttpServletRequest request) {
		return "joinForm";
	}
}
