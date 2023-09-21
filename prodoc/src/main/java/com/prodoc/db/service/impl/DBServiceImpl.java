package com.prodoc.db.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.mapper.DBMapper;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBService;

@Service
public class DBServiceImpl implements DBService {
	@Autowired
	DBMapper mapper;

	@Override
	public String insertDBCase(DBCaseVO vo) {
		mapper.insertDBCase(vo);
		return vo.getResult();
	}

	@Override
	public List<BlockVO> getDBPageList(String casePage) {
		return mapper.getDBPageList(casePage);
	}

}
