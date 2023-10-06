package com.prodoc.page.service;

public interface PageService {

	public String insertPage(PageVO pageVO);

	// 페이지 잠금
	public boolean LockCheckPage(PageVO pageVO);

	// 페이지 삭제여부(페이지메뉴)
	public boolean deleteCheckPage(PageVO pageVO);

	// 워크스페이스삭제되면 페이지까지 일괄삭제
	public void deleteIfWorkspace(String workId);

	// 페이지 알림 끄기켜기
	public int notifyPage(PageVO pageVO);

}
