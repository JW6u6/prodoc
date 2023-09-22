package com.prodoc.page.service;

public interface PageService {
	
	public String insertPage(PageVO pageVO);

	public boolean LockCheckPage(PageVO pageVO);
	
	public boolean deleteCheckPage(String pageId);
	
	public int notifyPage(PageVO pageVO);
	
}
