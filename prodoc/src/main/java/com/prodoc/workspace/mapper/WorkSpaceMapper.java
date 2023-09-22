package com.prodoc.workspace.mapper;

import java.util.List;

import com.prodoc.workspace.service.WorkJoinVO;
import com.prodoc.workspace.service.WorkSpaceVO;

public interface WorkSpaceMapper {
	public List<String> selectWorkNo(WorkSpaceVO workVO);
	
	//워크스페이스 단건조회
	public WorkSpaceVO selectOneWorkspace(String workId);

	// 워크스페이스 등록
	public void registerWorkspace(WorkSpaceVO workVO);
	// 워크스페이스 초대
	public void inviteWorkspace(WorkJoinVO joinVO);
	
	//팀 워크스페이스 초대목록
	public List<String> selectInvite(WorkJoinVO joinVO);

	// 워크스페이스 수정
	public int modifyWorkspace(WorkSpaceVO workVO);
	//워크스페이스(팀) 설정에서 소유자 수정하는건 member패키지로 따로 뺌

	// 워크스페이스 삭제(체크)
	public int removeCheckWorkspace(String workId);
	
	//워크스페이스 메인페이지 지정
	public int MainPgWorkspace(WorkSpaceVO workVO);
	
}
