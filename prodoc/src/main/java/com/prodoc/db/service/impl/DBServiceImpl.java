package com.prodoc.db.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.db.mapper.DBMapper;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBService;

@Service
public class DBServiceImpl implements DBService {
	@Autowired
	DBMapper mapper;

	@Override
	public void insertDBCase(DBCaseVO vo) {
		mapper.insertDBCase(vo);
		if(vo.result == "false") {
			System.out.println("false");
		}else if(vo.result == "success") {
			System.out.println("success");
		}
	}

}
