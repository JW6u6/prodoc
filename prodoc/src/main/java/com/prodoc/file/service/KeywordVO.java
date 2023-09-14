package com.prodoc.file.service;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("KeywordVO")
public class KeywordVO {
	private String email;
	private String keyword;
	private Date startDate;
	private Date endDate;
}
