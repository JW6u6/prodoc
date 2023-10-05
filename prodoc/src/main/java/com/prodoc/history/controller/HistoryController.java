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
	public String revokeProcess(@RequestBody int historyId) {
		System.out.println("history revoke id: " + historyId);
		HistoryVO history = new HistoryVO();
		history.setHistoryId(historyId);
		//service.revokeTrash(history);
		return "";
	}
}
