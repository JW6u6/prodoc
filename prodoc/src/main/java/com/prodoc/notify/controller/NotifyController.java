package com.prodoc.notify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.notify.service.NotifyService;

import lombok.Setter;

@RestController
public class NotifyController {

	@Setter(onMethod_ = @Autowired)
	NotifyService notiService;

}
