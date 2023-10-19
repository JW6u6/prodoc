package com.prodoc.workspace.mapper;

import java.util.List;

import com.prodoc.workspace.service.WorkJoinVO;
import com.prodoc.workspace.service.WorkSpaceVO;
import com.prodoc.workspace.service.allListVO;

public interface WorkSpaceMapper {
	//워크스페이스 리스트조회
	public List<WorkSpaceVO> workList(String email);
	public List<allListVO> allList(String email);
	public List<allListVO> partList(String workId);
	//워크스페이스 단건조회
	public WorkSpaceVO selectOneWorkspace(String workId);
	
	//워크스페이스 Id가져오기
	public String workId(String workName);

	// 워크스페이스 등록
	public void registerWorkspace(WorkSpaceVO workVO);
	// 워크스페이스 초대
	public void inviteWorkspace(WorkJoinVO joinVO);
	
	//팀 워크스페이스 초대목록
	public List<WorkJoinVO> selectInvite(String workId);

	// 워크스페이스 수정
	public int modifyWorkspace(WorkSpaceVO workVO);
	//워크스페이스(팀) 설정에서 소유자 수정하는건 member패키지로 따로 뺌

	// 워크스페이스 삭제(체크)
	public int removeCheckWorkspace(WorkSpaceVO workVO);
	
	//워크스페이스 메인페이지 지정
	public int MainPgWorkspace(WorkSpaceVO workVO);
	
	//초대코드로 워크스페이스 정보 가져오기
	public WorkSpaceVO InviteWorkInfo(String inviteId);
	
}
