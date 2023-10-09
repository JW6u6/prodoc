package com.prodoc.notify.controller;

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
	public Map<String, Object> alarmListProc(@RequestBody NotifyVO type, HttpServletRequest request){
		System.out.println(type +"============================");
		Map<String, Object> map = new HashMap<>();
		HttpSession session = request.getSession();
		String logUser = ((UserVO)session.getAttribute("logUser")).getEmail();
		List<NotifyResultVO> list = notiService.selectNotify(logUser, type.getNoteType());
		map.put("result", list);
		return map;
	}
}
