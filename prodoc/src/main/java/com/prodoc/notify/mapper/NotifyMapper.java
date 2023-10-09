package com.prodoc.notify.mapper;

import java.util.List;

import com.prodoc.notify.service.NotifyResultVO;
import com.prodoc.notify.service.NotifyVO;

public interface NotifyMapper {
	//댓글, 멘션 - 상우 / 페이지 잠금 - 시인
	public void insertTargetNotify(NotifyVO vo);
	
	//알림 읽음 설정 - 상우: targetnote
	public int readCheck(NotifyVO vo);
	
	public int redReadCheck(NotifyVO vo);
	
	//알림 목록 불러오기 -상우
	public List<NotifyResultVO> selectNotify(String logUser, String type);
	
	//초대 목록 불러오기
	public List<NotifyResultVO> selectNotifyInv(String logUser);
	//알림 삭제 - 상우
	public int deleteNotify(NotifyVO vo);
	
	//빨간 점 알림 안받기 - 시인언니
	public int noNotify(NotifyVO vo);
}
