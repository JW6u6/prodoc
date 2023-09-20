package com.prodoc.db.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBService;

@RestController
public class DBController {
	@Autowired
	DBService service;
	
	@PostMapping("InsertDBCase")
	public void InsertDBCase(DBCaseVO casePage) {
		service.insertDBCase(casePage);
	}
}