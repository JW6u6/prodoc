package com.prodoc.search.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.prodoc.search.service.ResultVO;
import com.prodoc.search.service.SearchService;
import com.prodoc.search.service.SearchVO;

@Controller
public class SearchController {
	@Autowired
	SearchService service;
	
	@ResponseBody
	@PostMapping("/SearchWKDB")
	public Map<String, Object> SearchProcess(@RequestBody SearchVO search) {
		System.out.println("searchVO: " + search.toString());
		Map<String, Object> result = new HashMap<>();
		List<ResultVO> data; 
		if(search.getType().equals("wk")) {
			data = service.searchBlock(search);
		}else {
			data = service.searchDB(search);
		}
		result.put("data", data);
		System.out.println("data:" + data);
		return result;
	}
}
