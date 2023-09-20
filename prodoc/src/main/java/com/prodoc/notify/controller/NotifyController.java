package com.prodoc.notify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.notify.service.NotifyService;
import com.prodoc.notify.service.NotifyVO;

import lombok.Setter;

@RestController
public class NotifyController {

	@Setter(onMethod_ = @Autowired)
	NotifyService notiService;

	@PostMapping("/alamInsert")
	public String targetAlamInsert(@RequestBody NotifyVO notiVO) {
		return notiService.TargetAlam(notiVO);
	}

}
