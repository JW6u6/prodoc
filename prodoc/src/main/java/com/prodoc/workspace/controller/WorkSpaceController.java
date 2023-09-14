package com.prodoc.workspace.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.workspace.mapper.WorkSpaceMapper;
import com.prodoc.workspace.service.WorkSpaceService;
import com.prodoc.workspace.service.WorkSpaceVO;

import lombok.Setter;

/*
 개발자: 김시인
 개발일자: 2023-09-14
 		워크스페이스 등록
 */

@CrossOrigin
@RestController
public class WorkSpaceController {
	
	@Setter(onMethod_ = @Autowired)
	WorkSpaceMapper WorkSpaceMapper;
	WorkSpaceService workspaceService;
	
	@GetMapping("workList")
	public List<String> workList(WorkSpaceVO workVO){
		return WorkSpaceMapper.selectWorkNo(workVO);
	}
	
	@PostMapping("workInsert")
	public void insertWorkspace(WorkSpaceVO workVO) {
		workspaceService.insertWorkspace(workVO);
	}
	
}
