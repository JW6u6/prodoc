package com.prodoc.notify.service;

import java.util.List;

public interface NotifyService {
	
	//댓글, 멘션 - 상우 / 페이지 잠금 - 시인
	public void insertTargetNotify(NotifyVO vo);
	
	//알림 읽음 설정 - 상우: targetnote
	public int readCheck(NotifyVO vo);
	
	public int redReadCheck(NotifyVO vo);
	
	//알림 목록 불러오기 -상우
	public List<NotifyResultVO> selectNotify(String logUser,String type);
	
	//알림 삭제 - 상우
	public int deleteNotify(List<NotifyVO> list);
	
	//빨간 점 알림 안받기 - 시인언니
	//public int noNotify(NotifyVO vo);

	//페이지 잠금/잠금해제 요청이 중복으로 들어가는걸 방지하기위해 목록을 불러오는거
};
