package com.prodoc.user.service;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailMessage {
	private String to; //받는사람
	private String subject; //제목
	private String message; //내용
}
