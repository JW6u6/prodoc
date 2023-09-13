package com.prodoc;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "com.prodoc.**.mapper")
public class ProdocApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProdocApplication.class, args);
	}

}
