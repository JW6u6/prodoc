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
	
	@Override
	public void insertWorkspace(WorkSpaceVO workVO) {
		workMapper.registerWorkspace(workVO);
		if(workVO.getResult().equals("TRUE")) {
			System.out.println("성공");
			
			if(workVO.getWorkType().equals("TEAM")) {
				WorkJoinVO joinVO = new WorkJoinVO();
				joinVO.setWorkId(workVO.getOutWid());
				workMapper.inviteWorkspace(joinVO);
			}
		}else{
			System.out.println("실패");
		};
	}

	@Override
	public WorkSpaceVO infoWorkspace(String workId) {
		return workMapper.selectOneWorkspace(workId);
	}

	@Override
	public void inviteWorkspaceUser(WorkJoinVO joinVO) {
		workMapper.inviteWorkspace(joinVO);
	}

	@Override
	public boolean editWorkspace(WorkSpaceVO workVO) {
		return workMapper.modifyWorkspace(workVO) == 1;
	}

	@Override
	public boolean deleteCheckWorkspace(String workId) {
		return workMapper.removeCheckWorkspace(workId) == 1;
	}

}
