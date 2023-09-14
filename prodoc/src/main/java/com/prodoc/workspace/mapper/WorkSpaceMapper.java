package com.prodoc.workspace.mapper;

import java.util.List;

import com.prodoc.workspace.service.WorkSpaceVO;

public interface WorkSpaceMapper {
	public List<String> selectWorkNo(WorkSpaceVO workVO);

	// 워크스페이스 등록
	public void registerWorkspace(WorkSpaceVO workVO);

	// 워크스페이스 수정(덜됨)
	public boolean modifyWorkspace(WorkSpaceVO workVO);
	// 팀스페이스인 경우 소유자 교체(덜만듦)
	public void renewOWNER(WorkSpaceVO workVO);

	// 워크스페이스 삭제
}
