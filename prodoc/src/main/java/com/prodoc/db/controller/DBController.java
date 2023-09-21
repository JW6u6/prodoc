package com.prodoc.db.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBService;
import com.prodoc.page.service.PageVO;

@RestController
public class DBController {
	@Autowired
	DBService service;
	
	@PostMapping("InsertDBCase")
	public String InsertDBCase(DBCaseVO casePage) {
		service.insertDBCase(casePage);
		return casePage.getResult();
	}
	
	@PostMapping("getDBPageList")
	public List<BlockVO> getDBPageList(@RequestBody PageVO page, Model model){
		String pageCage = page.getPageId();
		List<BlockVO> DBList = service.getDBPageList(pageCage);
		model.addAttribute("DBList", DBList);
		return DBList;
	}

}