package com.prodoc.workspace.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prodoc.workspace.mapper.WorkSpaceMapper;
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
		}else{
			System.out.println("실패");
		};
	}

}
