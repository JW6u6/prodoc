package com.prodoc.db.service;

import lombok.Data;

@Data
public class AddAttrVO {
	private String caseBlockId;
	private String attrId;
	private String attrName;
	private String attrContent;
	private String result;
}
