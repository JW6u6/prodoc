package com.prodoc.user.service;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("UserVO")
public class UserVO {
	String email;
	String password;
	String nickname;
	String phone;
	Date birth;
	String profile;
	String platform;
}
