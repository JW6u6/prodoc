package com.prodoc.config;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class AuthFailureHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		String errorMsg = "";
		if(exception instanceof BadCredentialsException) {
			errorMsg = "아이디 또는 비밀번호를 확인해주세요.";
        } else if(exception instanceof InternalAuthenticationServiceException) {
        	errorMsg = "아이디 또는 비밀번호를 확인해주세요.";
        } else if(exception instanceof DisabledException) {
        	errorMsg = "비활성화 계정입니다.";
        }
		request.setAttribute("errorMsg", errorMsg);
	
		request.getRequestDispatcher("/").forward(request, response);
	}

}
