package com.prodoc.page.mapper;

import java.util.List;

import com.prodoc.page.service.PageVO;

public interface PageMapper {
	public List<PageVO> pageList(String workName);
	
	public String selectPageInfo(PageVO pageVO);
	
	public void insertPage(PageVO pageVO);
	
	//페이지 잠금 요청이 들어오면 잠금(관리자, 소유자)
	public int LockPage(PageVO pageVO);
	
	//페이지 삭제여부 체크
	public int RemoveCheckPage(String pageId);
	
	//페이지 알림 끄기/켜기(값이 없으면(알림이 켜진 상태면) 입력하고 있으면(알림이 꺼진 상태면) 삭제)
	public void onOffPage(PageVO pageVO);
}
