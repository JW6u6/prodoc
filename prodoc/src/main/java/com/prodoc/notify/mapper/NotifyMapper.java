package com.prodoc.notify.mapper;

import com.prodoc.notify.service.NotifyVO;

public interface NotifyMapper {
	//타겟 지정 알림
	public void targetNotify(NotifyVO notiVO);
}
