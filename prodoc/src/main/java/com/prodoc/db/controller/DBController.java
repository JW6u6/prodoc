package com.prodoc.db.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBService;
import com.prodoc.db.service.PageAttrVO;
import com.prodoc.page.service.PageVO;

@RestController
@Transactional
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
	
	@PostMapping("getDBPageInfo")
	public List<Object> getDBPageInfo(@RequestBody String diplayId) {
		PageVO pageInfo = service.getDBPageInfo(diplayId);
		List<PageAttrVO> attrList = service.getPageAttr(diplayId);
		List<Object> result = new ArrayList<>();
		result.add(pageInfo);
		result.add(attrList);
		return result;
	}
}