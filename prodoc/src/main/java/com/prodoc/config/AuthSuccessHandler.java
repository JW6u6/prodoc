package com.prodoc.config;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.prodoc.user.service.UserService;
import com.prodoc.user.service.UserVO;

public class AuthSuccessHandler implements AuthenticationSuccessHandler {
	@Autowired
	UserService service;
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		
		System.out.println("===================="+authentication.getName());
		UserVO vo = new UserVO();
		vo.setEmail(authentication.getName());
		System.out.println(vo);
		HttpSession session = request.getSession();
		System.out.println(session);
		session.setAttribute("logUser", service.getUser(vo));
		
		
		response.sendRedirect("/home");
	}

}
