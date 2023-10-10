package com.prodoc.notify.service;

import java.util.List;

public interface NotifyService {
	
	//댓글, 멘션 - 상우 / 페이지 잠금 - 시인
	public void insertTargetNotify(NotifyVO vo);
	
	//알림 읽음 설정 - 상우: targetnote
	public int readCheck(NotifyVO vo);
	
	//알림 목록 불러오기 -상우
	public List<NotifyResultVO> selectNotify(String type);
	
	//알림 삭제 - 상우
	public int deleteNotify(NotifyVO vo);
	
//	//빨간 점 알림 안받기 - 시인언니
//	public int noNotify(NotifyVO vo);
	//페이지쪽에 있음.

};
