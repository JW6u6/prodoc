package com.prodoc.page.service;


public interface PageService {

	public String insertPage(PageVO pageVO);

	// 페이지 잠금
	public boolean LockCheckPage(PageVO pageVO);
	
	public int updatePage(PageVO PageVO);
	
	public int updateInPage(PageVO PageVO);
	
	public int updateNumPlus(PageVO PageVO);
	
	public int updateNumMinus(PageVO PageVO);

	// 페이지 삭제여부(페이지메뉴)
	public boolean deleteCheckPage(PageVO pageVO);

	// 워크스페이스삭제되면 페이지까지 일괄삭제
	public void deleteIfWorkspace(String workId);

	// 페이지 알림 끄기켜기
	public int notifyPage(PageVO pageVO);

	public int onOff(PageVO pageVO);
	
	//페이지 잠금해제 요청(일반 사용자)
	public void LockAlam(PageVO pageVO);
	//페이지 이름 변경
	public String newName(PageVO pageVO);
	
	//페이지 복사
	public String pastePage(PageVO pageVO);
	
	//디비 페이지 삭제하면 블럭으로된것도 삭제 
	public void deleteDBPageBlock(PageVO pageVO);
}
