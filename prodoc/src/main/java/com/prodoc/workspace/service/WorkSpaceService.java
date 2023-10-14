package com.prodoc.workspace.service;

import java.util.List;

public interface WorkSpaceService {

	public List<allListVO> allList(String email);
	
	// 워크스페이스 단건 조회
	public WorkSpaceVO infoWorkspace(String workId);

	// 워크스페이스 등록
	public String insertWorkspace(WorkSpaceVO workVO);

	// 워크스페이스 초대
	public int inviteWorkspaceUser(List<WorkJoinVO> joinVO);

	// 워크스페이스 초대리스트
	public List<WorkJoinVO> inviteListWorkspace(String workId);

	// 워크스페이스 수정
	public boolean editWorkspace(WorkSpaceVO workVO);

	// 워크스페이스 삭제(체크)
	public boolean deleteCheckWorkspace(WorkSpaceVO workVO);

	// 워크스페이스 메인페이지 지정
	public boolean assignMainPage(WorkSpaceVO workVO);
}
