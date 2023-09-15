package com.prodoc.block.service;

import lombok.Data;

@Data
public class BlockVO {
	private String displayId;
	private String parentId;
	private String originId;
	private String pageId;
	private int rowX;
	private int rowY;
	private String blockId;
	private int width;
	private int height;
	private String creUser;
	private String creDate;
	private String upUser;
	private String upDate;
	private String content;
	private String mentionList;
	private String color;
	private String backColor;
}
