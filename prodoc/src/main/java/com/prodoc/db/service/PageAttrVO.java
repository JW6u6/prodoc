package com.prodoc.db.service;

import lombok.Data;

@Data
public class PageAttrVO {
	// 뷰의 반환값
	private String pageId;
	private String casePageId;
	private String dbUseId;
	private String pageUseId;
	private String attrId;
	private String attrName;
	private String attrContent;
	private int numbering;
	private String displayCheck;
	private String displayId;
	private String nickname;
}
