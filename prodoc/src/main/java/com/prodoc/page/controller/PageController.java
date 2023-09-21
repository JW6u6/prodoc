package com.prodoc.page.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.page.mapper.PageMapper;
import com.prodoc.page.service.PageService;
import com.prodoc.page.service.PageVO;

import lombok.Setter;

@CrossOrigin
@RestController
public class PageController {
	@Autowired
	PageMapper pageMapper;
	
	@Setter(onMethod_ = @Autowired)
	PageService pageService;
	
	@GetMapping("pageList")
	public List<PageVO> pageList(PageVO pageVO){
		return pageMapper.pageList(pageVO);
	}
	
	@GetMapping("pageInfo")
	public PageVO pageInfo(PageVO pageVO) {
		return pageMapper.selectPageInfo(pageVO);
	}
	
	@PostMapping("pageInsert")
	public PageVO pageInsert(@RequestBody PageVO pageVO) {
		pageMapper.insertPage(pageVO);
		return pageVO;
	}
	
	//페이지 잠금/잠금해제(소유자, 관리자 권한)
	@PostMapping("/pageLock")
	public String pageLockCheck(@RequestBody PageVO pageVO) {
		pageService.LockCheckPage(pageVO);
		return pageVO.getLockCheck();
	}
	
	//페이지 삭제 체크(삭제시 삭제 체크 값이 true로 등록)
	@PostMapping("/pageDelCheck")
	public void pageDeleteCheck(String pageId) {
		pageService.deleteCheckPage(pageId);
	}
	
	
	//페이지 알림 끄기/켜기
	@PostMapping("/pageNotify")
	public int pageNotifyed(@RequestBody PageVO pageVO) {
		return pageService.notifyPage(pageVO);
	}
	
}
