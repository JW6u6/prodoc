package com.prodoc.workspace.service;


public interface WorkSpaceService {

	//워크스페이스 단건 조회
	public WorkSpaceVO infoWorkspace(String workId);
	
	//워크스페이스 등록
	public void insertWorkspace(WorkSpaceVO workVO);
	
	//워크스페이스 초대
	public void inviteWorkspaceUser(WorkJoinVO joinVO);
	
	//워크스페이스 수정
	public boolean editWorkspace(WorkSpaceVO workVO);
	
	//워크스페이스 삭제(체크)
	public boolean deleteCheckWorkspace(String workId);
}
