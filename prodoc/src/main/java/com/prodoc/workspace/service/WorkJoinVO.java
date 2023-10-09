package com.prodoc.workspace.service;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("WorkJoinVO")
public class WorkJoinVO {
	private String inviteEmail;
	private String workId;
	private String inviteId;
	private Date invDate;
	private String creUser; //발신자.

	// 초대했을 때 out 결과를 받아오기 위한 필드
	private String result;
}
