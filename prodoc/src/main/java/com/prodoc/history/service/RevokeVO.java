package com.prodoc.history.service;

import lombok.Data;

@Data
public class RevokeVO {
	String logUser;
	String pageId;
	String workId;
	String msg;
}
