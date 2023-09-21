package com.prodoc.notify.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.notify.mapper.NotifyMapper;
import com.prodoc.notify.service.NotifyService;
import com.prodoc.notify.service.NotifyVO;

import lombok.Setter;

@Service
public class NotifyServiceImpl implements NotifyService {

	@Setter(onMethod_ = @Autowired)
	NotifyMapper notiMapper;

	@Override
	public String TargetAlam(NotifyVO notiVO) {
		notiMapper.targetNotify(notiVO);
		return notiVO.getResult();
	}

}
