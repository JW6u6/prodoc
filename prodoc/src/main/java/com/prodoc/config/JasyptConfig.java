package com.prodoc.config;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JasyptConfig {
	// 암호화키
	@Value("${prodoc.jasypt.encryptor.password}")
	private String password;


	// 암호화를 제어할 빈에 대한 설정
	@Bean("jasyptStringEncryptor")
	public StringEncryptor stringEncryptor() {
		PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();

		// 설정
		SimpleStringPBEConfig config = new SimpleStringPBEConfig();
		config.setPassword(password);
		config.setAlgorithm("PBEWITHHMACSHA512ANDAES_256");
		config.setKeyObtentionIterations("1000");
		config.setPoolSize("1");
		config.setProviderName("SunJCE");
		config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
		config.setIvGeneratorClassName("org.jasypt.iv.RandomIvGenerator");
		config.setStringOutputType("base64");

		// 설정한거 적용
		encryptor.setConfig(config);
		return encryptor;
	}
}
