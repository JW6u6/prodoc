package com.prodoc.notify.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.prodoc.notify.service.NotifyResultVO;
import com.prodoc.notify.service.NotifyService;
import com.prodoc.notify.service.NotifyVO;
import com.prodoc.user.service.UserVO;

import lombok.Setter;

@Controller
public class NotifyController {

	@Setter(onMethod_ = @Autowired)
	NotifyService notiService;

	@ResponseBody
	@PostMapping("/alarmList")
	public Map<String, Object> alarmListProc(@RequestBody NotifyVO type, HttpServletRequest request) {
		System.out.println(type + "============================");
		Map<String, Object> map = new HashMap<>();
		HttpSession session = request.getSession();
		String logUser = ((UserVO) session.getAttribute("logUser")).getEmail();
		List<NotifyResultVO> list = notiService.selectNotify(logUser, type.getNoteType());
		map.put("result", list);
		return map;
	}
	
	@ResponseBody
	@PostMapping("/alarmDelete")
	public String alarmDelete(@RequestBody List<NotifyVO> list) {
		if( notiService.deleteNotify(list) > 0)
			return "{\"result\": true}";
		
		return "{\"result\": false}";
	}
	
	@ResponseBody
	@PostMapping("/alarmRead")
	public String alarmRead(@RequestBody List<NotifyVO> list) {
		if( notiService.readCheck(list) > 0)
			return "{\"result\": true}";
		
		return "{\"result\": false}";
	}
	
	@GetMapping("/areULOCK")
	@ResponseBody
	public int hasLockAlam(String pageId) {
		return notiService.donTDupleLock(pageId);
	}
	
	@ResponseBody
	@PostMapping("/clickInvite")
	public void clickInvite(@RequestBody NotifyResultVO vo) {
		notiService.clickInvite(vo);
	}
}
