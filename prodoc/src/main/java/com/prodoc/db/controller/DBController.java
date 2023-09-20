package com.prodoc.db.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBPageVO;
import com.prodoc.db.service.DBService;

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
	public List<DBPageVO> getDBPageList(@RequestBody String pageCase){
		return service.getDBPageList("in328-rsvwv-54tpib");
	}
	
	@GetMapping("DBPage")
	public String openDBPage() {
		return "";
	}
}