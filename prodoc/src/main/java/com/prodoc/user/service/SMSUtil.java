package com.prodoc.user.service;

import java.util.Random;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

@Component
public class SMSUtil { 
	@Value("${coolsms.api.key}")
    private String apiKey;
	
    @Value("${coolsms.api.secret}")
    private String apiSecretKey;

    private DefaultMessageService smsService;
    
    public void init() {
        this.smsService = NurigoApp.INSTANCE.initialize(apiKey, apiSecretKey, "https://api.coolsms.co.kr");
    }
    
    public String sendSMSAuth(String phone) {
        Message message = new Message();
        Random random = new Random();
        String authNum = "";
        for(int i=0;i<6;i++) {
        	authNum += Integer.toString(random.nextInt(10));
        }
        System.out.println(phone);
        message.setFrom("01048290270");
        message.setTo(phone);
        message.setText("[PRODOC] 인증번호 : " + authNum);

        SingleMessageSentResponse response = this.smsService.sendOne(new SingleMessageSendingRequest(message));
       
        return authNum;
    }
}
