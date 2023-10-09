package com.prodoc.workspace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Service
@RequiredArgsConstructor
public class InviteEmailService {
	
	@Setter(onMethod_ = @Autowired)
	WorkSpaceService workService;

	public String sendMail(WorkJoinVO joinVO) {
		
		return "";
	}
}
