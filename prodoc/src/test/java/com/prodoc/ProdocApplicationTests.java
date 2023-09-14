package com.prodoc;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;

import org.jasypt.encryption.StringEncryptor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.prodoc.user.service.EmailService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootTest
class ProdocApplicationTests {

	@Autowired
	private EmailService emailService;
	@Autowired
	StringEncryptor jasyptStringEncryptor;
	@Test
	void contextLoads() {
		String[] datas = {
				"smtp.gmail.com",
				"587",
				"8520hana@gmail.com",
				"truoozlqqvoupwll"
				};
		
		for(String data : datas) {
			String enyData = jasyptStringEncryptor.encrypt(data);
			System.out.println(enyData);
		}
	}

}
