package com.prodoc.user.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.prodoc.user.service.EmailService;
import com.prodoc.user.service.ProfileService;
import com.prodoc.user.service.UserService;
import com.prodoc.user.service.UserVO;

/*
개발자 : 김은주
개발일자 : 2023.09.14~
		 회원가입: 화면 & 프로세스
*/
@Controller
public class JoinController {
	@Autowired
	private EmailService emailService;	//이메일 인증 서비스
	@Autowired
	UserService service;	//user 관련 db 서비스
	@Autowired
	ProfileService proService; 			//프로필 이미지 저장 서비스

	@GetMapping("/join")
	public String JoinForm(HttpServletRequest request) {
		return "joinForm";
	}
	
	@PostMapping("/join")
	public String JoinProcess(UserVO user, @RequestPart(value="file",required = false) MultipartFile mfile) {
		String uploadName = proService.fileUploadName(mfile);	//서비스에서 이미지 업로드네임 가져옴
		user.setProfile(uploadName);
		service.join(user); //회원가입
		return "login";			
	}
	@ResponseBody
	@PostMapping("/searchEmail")
	public String searchEmail(@RequestBody UserVO user, Model model) {
		UserVO search = service.getUser(user);
		
		if(search != null)	return "{\"result\":true}"; //메일이 있음
		String authNum = emailService.sendMail(user.getEmail());
		model.addAttribute("authNum", authNum);
		return "{\"result\":false , \"code\" : \""+ authNum +"\"}"; //메일이 없음
	}
}
