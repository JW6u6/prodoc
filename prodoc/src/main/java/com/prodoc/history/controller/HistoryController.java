package com.prodoc.history.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.prodoc.history.service.HisSearchVO;
import com.prodoc.history.service.HistoryService;
import com.prodoc.history.service.HistoryVO;
import com.prodoc.history.service.RevokeVO;
import com.prodoc.page.service.PageVO;

@Controller
public class HistoryController {
	
	@Autowired
	HistoryService service;
	
	@ResponseBody
	@PostMapping("/history")
	public Map<String, Object> historyProcess(@RequestBody HisSearchVO search){
		System.out.println(search.toString());
		List<HistoryVO> historyList = service.getHistory(search);
		Map<String, Object> result = new HashMap<>();
		result.put("historyList", historyList);
		return result;
	}
	
	@ResponseBody
	@PostMapping("/revokeTrash")
	public RevokeVO revokeProcess(@RequestBody RevokeVO revoke) {
		System.out.println("history revoke: " + revoke.toString());
		Map<String, Object> map = new HashMap<>();
		if(revoke.getPageId() == null) {	//워크 복구
			revoke = service.revokeWork(revoke);
		}else {				//페이지 복구
			revoke = service.revokePage(revoke);
		}
		return revoke;
	}
}
