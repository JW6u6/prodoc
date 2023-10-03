package com.prodoc.user.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.view.RedirectView;

import com.prodoc.user.service.KakaoService;
import com.prodoc.user.service.KakaoVO;
import com.prodoc.user.service.UserService;
import com.prodoc.user.service.UserVO;

/*
 개발자 : 김은주
 개발일자 : 2023.09.13~
 		 로그인: 화면 & 프로세스
 */
@Controller
public class LoginController {
	@Autowired
	UserService service;
	@Autowired
	KakaoService kakaoService;
	
	@RequestMapping(value = "/")
	public String goMain(HttpServletRequest request, Model model) {
		model.addAttribute("kakaoUrl", kakaoService.getKakaoLogin());
		return "login";
	}
	
	@ResponseBody
	@GetMapping("/kakao")
    public RedirectView callback(HttpServletRequest request) throws Exception {
		UserVO user = kakaoService.getKakaoInfo(request.getParameter("code"));
		
        //같은 이메일 존재 판별
        UserVO find = service.getUser(user);
        if(find == null){        						//가입 이력이 없음
	        service.join(user);							//가입
	        HttpSession session = request.getSession();
			session.setAttribute("logUser", user);		//세션 등록
	        return new RedirectView("/home");
        }else if(find.getPlatform().equals("KAKAO")) {	//이미 카카오로 인증 했음
        	HttpSession session = request.getSession();
			session.setAttribute("logUser", user);		//세션 등록
        	return new RedirectView("/home");
        }else {											//같은 이메일로 기본 가입함
        	request.setAttribute("kakao", "이미 가입된 이메일입니다.");
        	return new RedirectView("/");
        }
    }
}
