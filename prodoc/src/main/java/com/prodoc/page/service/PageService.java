package com.prodoc.page.service;

public interface PageService {

	public boolean LockCheckPage(PageVO pageVO);
	
	public boolean deleteCheckPage(String pageId);
	
	public int notifyPage(PageVO pageVO);
	
}
