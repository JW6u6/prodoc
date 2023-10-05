package com.prodoc.trash.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.history.service.HistoryVO;
import com.prodoc.trash.mapper.TrashMapper;
import com.prodoc.trash.service.TrashResultVO;
import com.prodoc.trash.service.TrashService;
import com.prodoc.trash.service.TrashVO;

@Service
public class TrashServiceImpl implements TrashService {
	@Autowired
	TrashMapper mapper;
	
	@Override
	public List<TrashResultVO> getTrash(TrashVO trash) {
		return mapper.selectList(trash);
	}

	@Override
	public int revokeTrash(HistoryVO history) {
		return 0;
	}


}
