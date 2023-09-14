package com.prodoc.file.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class FileController {
	
	@GetMapping("fileSearch")
	public String getFileList(){
		return "content/fileSearch";
	}

}
