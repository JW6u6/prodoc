package com.prodoc.file.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.db.service.PageAttrVO;
import com.prodoc.db.service.dbattrFileService;
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
	
	@Autowired
	dbattrFileService dbservice;
	
	@PostMapping("getFileList")
	public List<SelectFileVO> getFileList(@RequestBody KeywordVO vo, HttpServletRequest request){
		HttpSession session = request.getSession();
		UserVO user = (UserVO)session.getAttribute("logUser");
		vo.setEmail(user.getEmail());
		log.info(vo.toString());
		return service.getFileList(vo);
	}
	
	
	@GetMapping("/addrfile/download")
	public ResponseEntity<Resource> FileDownloadProc(@RequestParam String id){
		PageAttrVO file = service.fileDownload(id);
		Resource resource = dbservice.readFileAsResource(id);
		
		String filename;
		try {
			filename = URLEncoder.encode(file.getAttrContent(), "UTF-8");
			return ResponseEntity.ok()
					.contentType(MediaType.APPLICATION_OCTET_STREAM)
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; fileName=\"" + filename + "\";")
					.body(resource);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		return null;
	}
}
