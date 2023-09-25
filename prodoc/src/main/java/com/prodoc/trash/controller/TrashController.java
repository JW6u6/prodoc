package com.prodoc.trash.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.prodoc.history.service.HistoryVO;
import com.prodoc.trash.service.TrashService;
import com.prodoc.trash.service.TrashVO;

@Controller
public class TrashController {
	@Autowired
	TrashService service;
	
	@PostMapping("/trash")
	public Map<String, Object> trashProcess(@RequestBody TrashVO trash){
		System.out.println(trash);
		Map<String, Object> result = new HashMap<>();
		List<HistoryVO> history = service.getTrash(trash);
		result.put("history", history);
		
		return result;
	}
}
