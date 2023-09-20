package com.prodoc.member.service;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("MemberVO")
public class MemberVO {
	private String workId;
	private String email;
	private String auth;
	private int numbering;
}
