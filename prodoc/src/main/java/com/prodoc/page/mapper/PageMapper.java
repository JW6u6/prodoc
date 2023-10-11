package com.prodoc.page.mapper;

import java.util.List;

import com.prodoc.page.service.PageVO;

public interface PageMapper {
	public List<PageVO> pageList(String workName);

	public String findWork(String pageId);

	public List<PageVO> pageInPage(String pageId);

	public List<PageVO> selectPageInfo(String pageId);

	public void insertPage(PageVO pageVO);
	
	public int updatePage(PageVO pageVO);

	// 페이지 잠금 요청이 들어오면 잠금(관리자, 소유자)
	public int LockPage(PageVO pageVO);

	// 페이지 삭제여부 체크
	public int RemoveCheckPage(String pageId);

	// 페이지 삭제되면 자식 페이지들이 다 삭제되는 기능.
	public void RemoveChildPage(String pageId);

	// 워크스페이스 지우면 페이지들이 전부 삭제(체크)되는 기능
	public int ifWorkRemove(String workId);

	// 페이지 알림 끄기/켜기(값이 없으면(알림이 켜진 상태면) 입력하고 있으면(알림이 꺼진 상태면) 삭제)
	public void onOffPage(PageVO pageVO);
	
	//페이지메뉴 알림 끄기켜기 표시
	public int selectTurnOn(PageVO pageVO);
	
	//페이지 이름 변경
	public int newName(PageVO pageVO);
}
