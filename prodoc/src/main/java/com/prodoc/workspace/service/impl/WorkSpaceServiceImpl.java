package com.prodoc.workspace.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.workspace.mapper.WorkSpaceMapper;
import com.prodoc.workspace.service.WorkJoinVO;
import com.prodoc.workspace.service.WorkSpaceService;
import com.prodoc.workspace.service.WorkSpaceVO;

import lombok.Setter;

@Service
public class WorkSpaceServiceImpl implements WorkSpaceService {

	@Setter(onMethod_ = @Autowired)
	WorkSpaceMapper workMapper;

	// 워크스페이스 생성
	@Override
	public String insertWorkspace(WorkSpaceVO workVO) {
		workMapper.registerWorkspace(workVO);
		if (workVO.getResult().equals("TRUE")) {
			return workVO.getOutWid();
		} else {
			return workVO.getOutWid();
		}
	}

	@Override
	public WorkSpaceVO infoWorkspace(String workId) {
		return workMapper.selectOneWorkspace(workId);
	}

	@Override
	public String inviteWorkspaceUser(WorkJoinVO joinVO) {
		workMapper.inviteWorkspace(joinVO);
		return joinVO.getResult();
	}

	@Override
	public boolean editWorkspace(WorkSpaceVO workVO) {
		return workMapper.modifyWorkspace(workVO) == 1;
	}

	@Override
	public boolean deleteCheckWorkspace(String workId) {
		return workMapper.removeCheckWorkspace(workId) == 1;
	}

	@Override
	public boolean assignMainPage(WorkSpaceVO workVO) {
		return workMapper.MainPgWorkspace(workVO) == 1;
	}

}
