package com.prodoc.page.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	@GetMapping("/pageList")
	public List<PageVO> pageList(@RequestParam String workId){
		return pageMapper.pageList(workId);
	}
	@GetMapping("/findWork")
	public String findWork(@RequestParam String pageId){
		return pageMapper.findWork(pageId);
	}
	@GetMapping("/pageInPage")
	public List<PageVO> pageInPage(@RequestParam String pageId){
		return pageMapper.pageInPage(pageId);
	}
	@GetMapping("/pageInfo")
	public String pageInfo(PageVO pageVO) {
		return pageMapper.selectPageInfo(pageVO);
	}
	
	@PostMapping("/pageInsert")
	public String pageInsert(@RequestBody PageVO pageVO) {
		return pageService.insertPage(pageVO);
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
