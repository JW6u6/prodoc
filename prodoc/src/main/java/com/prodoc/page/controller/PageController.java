package com.prodoc.page.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.page.mapper.PageMapper;
import com.prodoc.page.service.PageVO;

@CrossOrigin
@RestController
public class PageController {
	@Autowired
	PageMapper pageMapper;
	
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
}
