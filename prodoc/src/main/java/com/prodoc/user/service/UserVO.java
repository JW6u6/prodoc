package com.prodoc.user.service;

import java.util.Date;

import org.apache.ibatis.type.Alias;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
@Alias("UserVO")
public class UserVO {
	String email;  
	String password;
	String nickname;
	String phone;
	@DateTimeFormat(pattern = "yyMMdd")
	Date birth;
	String profile;
	String platform;
}
