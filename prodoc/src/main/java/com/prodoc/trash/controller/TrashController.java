package com.prodoc.trash.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.prodoc.history.service.HistoryVO;
import com.prodoc.trash.service.TrashResultVO;
import com.prodoc.trash.service.TrashService;
import com.prodoc.trash.service.TrashVO;

@Controller
public class TrashController {
	@Autowired
	TrashService service;
	
	@ResponseBody
	@PostMapping("/trash")
	public Map<String, Object> trashProcess(@RequestBody TrashVO trash){
		System.out.println(trash.toString());
		List<TrashResultVO> trashList = service.getTrash(trash);
		Map<String, Object> result = new HashMap<>();
		result.put("trashList", trashList);
		return result;
	}
	
	@PostMapping("/revokeTrash")
	public String revokeProcess(int historyId) {
		System.out.println("history revoke id: " + historyId);
		HistoryVO history = new HistoryVO();
		history.setHistoryId(historyId);
		service.revokeTrash(history);
		return "";
	}
}
