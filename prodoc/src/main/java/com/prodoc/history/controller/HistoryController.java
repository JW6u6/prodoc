package com.prodoc.history.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.prodoc.history.service.HisSearchVO;
import com.prodoc.history.service.HistoryService;
import com.prodoc.history.service.HistoryVO;
import com.prodoc.history.service.RevokeVO;
import com.prodoc.user.service.UserVO;

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
	public Map<String, Object> revokeProcess(@RequestBody RevokeVO revoke, HttpServletRequest request) {
		HttpSession session = request.getSession();
		revoke.setLogUser(((UserVO)session.getAttribute("logUser")).getEmail());
		//System.out.println("history revoke: " + revoke.toString());
		Map<String, Object> map = new HashMap<>();
		if(revoke.getPageId() == null) {	//워크 복구
			revoke = service.revokeWork(revoke);
		}else {				//페이지 복구
			revoke = service.revokePage(revoke);
		}
		map.put("msg", revoke.getMsg());
		map.put("logUser", ((UserVO)session.getAttribute("logUser")).getEmail());
		return map;
	}
}
