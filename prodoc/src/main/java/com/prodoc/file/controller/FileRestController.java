package com.prodoc.file.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.file.service.FileSearchService;
import com.prodoc.file.service.KeywordVO;
import com.prodoc.file.service.SelectFileVO;
import com.prodoc.user.service.UserVO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class FileRestController {

	@Autowired
	FileSearchService service;
	
	@GetMapping("getFileList")
	public List<SelectFileVO> getFileList(KeywordVO vo, HttpServletRequest request){
		//HttpSession session = request.getSession();
		//UserVO user = (UserVO)session.getAttribute("logUser");
		//vo.setEmail(user.getEmail());
		vo.setEmail("test001@naver.com");
		log.info(vo.toString());
		return service.getFileList(vo);
	}
	
}
