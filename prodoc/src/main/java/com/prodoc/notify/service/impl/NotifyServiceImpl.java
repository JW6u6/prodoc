package com.prodoc.notify.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.notify.mapper.NotifyMapper;
import com.prodoc.notify.service.NotifyResultVO;
import com.prodoc.notify.service.NotifyService;
import com.prodoc.notify.service.NotifyVO;

import lombok.Setter;

@Service
public class NotifyServiceImpl implements NotifyService {

	@Setter(onMethod_ = @Autowired)
	NotifyMapper notiMapper;

	@Override
	public void insertTargetNotify(NotifyVO vo) {
		notiMapper.insertTargetNotify(vo);
	}

	@Override
	public int readCheck(NotifyVO vo) {
		return 0;
	}

	@Override
	public List<NotifyResultVO> selectNotify(String type) {
		return notiMapper.selectNotify(type);
	}

	@Override
	public int deleteNotify(NotifyVO vo) {
		return 0;
	}

//	@Override
//	public int noNotify(NotifyVO vo) {
//		return 0;
//	}

	
}
