package com.prodoc.workspace.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.workspace.mapper.WorkSpaceMapper;
import com.prodoc.workspace.service.WorkJoinVO;
import com.prodoc.workspace.service.WorkSpaceService;
import com.prodoc.workspace.service.WorkSpaceVO;

import lombok.Setter;

/*
 개발자: 김시인
 개발일자: 2023-09-14~15
 		워크스페이스 등록/조회/생성/수정/삭제/워크스페이스에 초대(팀.스.일시)
 */

@CrossOrigin
@RestController
public class WorkSpaceController {
	
	@Setter(onMethod_ = @Autowired)
	WorkSpaceMapper WorkSpaceMapper;
	
	@Setter(onMethod_ = @Autowired)
	WorkSpaceService workspaceService;
	
	//사이드바에 워크스페이스 목록 출력
	@GetMapping("/workList")
	public List<String> workList(WorkSpaceVO workVO){
		return WorkSpaceMapper.selectWorkNo(workVO);
	}
	
	//워크스페이스 단건 조회
	@GetMapping("/workInfo")
	public WorkSpaceVO workInfo(String workId) {

		return workspaceService.infoWorkspace(workId);
	}
	
	//워크스페이스 새로 생성
	@PostMapping("/workInsert")
	public void workspaceInsert(WorkSpaceVO workVO) {
		workspaceService.insertWorkspace(workVO);
	}
	
	//워크스페이스 생성시 유저 초대
	@PostMapping("/workJoin")
	public void workspaceJoin(WorkJoinVO joinVO) {
		workspaceService.inviteWorkspaceUser(joinVO);
	}
	
	
	//워크스페이스 수정
	@PostMapping("/workEdit")
	public void workspaceEdit(WorkSpaceVO workVO) {
		workspaceService.editWorkspace(workVO);
	}
	
	//워크스페이스 삭제
	@PostMapping("/workDelete")
	public void workspaceDeleteCheck(String workId) {
		workspaceService.deleteCheckWorkspace(workId);
	}
	
}
