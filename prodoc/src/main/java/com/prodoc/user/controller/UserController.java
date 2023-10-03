package com.prodoc.user.controller;


import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.prodoc.user.service.ProfileService;
import com.prodoc.user.service.SMSUtil;
import com.prodoc.user.service.UserService;
import com.prodoc.user.service.UserVO;

import retrofit2.http.POST;

@Controller
public class UserController {
	@Autowired
	UserService service;
	@Autowired
	PasswordEncoder passwordEncoder;
	@Autowired
	ProfileService proService; 			//프로필 이미지 저장 서비스
	@Autowired
	SMSUtil sms;
	
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
	
	@ResponseBody
	@PostMapping("/userMod")		//유저업데이트
	public String JoinProcess(UserVO user, MultipartFile file, HttpServletRequest request) {
		System.out.println("profile" + file);
		String uploadName = proService.fileUploadName(file);	//서비스에서 이미지 업로드네임 가져옴
		user.setProfile(uploadName);
		System.out.println("UserVO" + user.toString());
		return service.modifyInfo(user, request); //정보 수정
	}
	
	@ResponseBody
    @PostMapping("/sendSMS")
    public String PhoneAuthProcess(@RequestBody UserVO user) {
		System.out.println("sendSMS: " + user.toString());
    	sms.init();
    	String result = sms.sendSMSAuth(user.getPhone());
    	return "{\"authNum\" : " + result + "}";
    }
	
	@ResponseBody
	@PostMapping("/findME")
	public UserVO findProcess(@RequestBody UserVO user) {
		UserVO vo = service.getFind(user);
		System.out.println("findME: " + user.toString());
		System.out.println("findME: " + vo);
		return vo;
	}
}
