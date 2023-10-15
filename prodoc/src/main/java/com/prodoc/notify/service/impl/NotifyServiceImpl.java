package com.prodoc.notify.service.impl;

import java.util.ArrayList;
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
	public int readCheck(List<NotifyVO> list) {
		int count = 0;
		for(NotifyVO vo : list) {
			notiMapper.readCheck(vo);
			count++;
		}
		return count;
	}
	
	@Override
	public int redReadCheck(NotifyVO vo) {
		return notiMapper.redReadCheck(vo);
	}
	
	@Override
	public List<NotifyResultVO> selectNotify(String logUser,String type) {
		List<NotifyResultVO> list = new ArrayList<>();
		if(type.equals("all") || type.equals("REPLY_TG"))
			list.addAll(notiMapper.selectNotify(logUser, type));
		if(type.equals("all") || type.equals("invite"))
			list.addAll(notiMapper.selectNotifyInv(logUser));
		
		return list;
	}
	

	@Override
	public int deleteNotify(List<NotifyVO> list) {
		int count = 0;
		for(NotifyVO vo : list) {
			notiMapper.deleteNotify(vo);
			count++;
		}
		return  count;
	}

	@Override
	public int donTDupleLock(String pageId) {
		return notiMapper.notLockDuple(pageId);
	}


	@Override
	public NotifyResultVO getNotify(String workId) {
		return notiMapper.getNotify(workId);
	}
}
