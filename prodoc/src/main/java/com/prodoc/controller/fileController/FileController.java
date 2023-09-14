package com.prodoc.controller.fileController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.prodoc.file.service.FileSearchService;
import com.prodoc.file.service.SelectFileVO;

@Controller
public class FileController {
	
	@Autowired
	FileSearchService service;
	
	@GetMapping("fileSearch")
	public String getFileList(Model model){
		List<SelectFileVO> fileList = service.getFileList();
		model.addAttribute("fileList", fileList);
		return "content/fileSearch";
	}
}
