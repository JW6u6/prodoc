package com.prodoc.file.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.file.service.FileSearchService;
import com.prodoc.file.service.SelectFileVO;

@RestController
public class FileRestController {

	@Autowired
	FileSearchService service;
	
	@GetMapping("getFileList")
	public List<SelectFileVO> getFileList(Model model){
		return service.getFileList();
	}
	
}
