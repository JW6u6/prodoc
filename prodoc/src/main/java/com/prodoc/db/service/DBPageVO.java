package com.prodoc.db.service;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("DBPageVO")
public class DBPageVO {
	private String DisplayId;
	private String PageId;
}
