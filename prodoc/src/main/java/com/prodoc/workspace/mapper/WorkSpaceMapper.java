package com.prodoc.workspace.mapper;

import java.util.List;

import com.prodoc.workspace.service.WorkSpaceVO;

public interface WorkSpaceMapper {
	public List<String> selectWorkNo(WorkSpaceVO workVO);
}

