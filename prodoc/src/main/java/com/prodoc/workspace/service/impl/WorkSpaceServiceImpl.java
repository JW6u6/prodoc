package com.prodoc.workspace.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prodoc.history.service.HistoryService;
import com.prodoc.history.service.HistoryVO;
import com.prodoc.page.service.PageService;
import com.prodoc.page.service.PageVO;
import com.prodoc.workspace.mapper.WorkSpaceMapper;
import com.prodoc.workspace.service.WorkJoinVO;
import com.prodoc.workspace.service.WorkSpaceService;
import com.prodoc.workspace.service.WorkSpaceVO;

import lombok.Setter;

@Service
public class WorkSpaceServiceImpl implements WorkSpaceService {

	@Setter(onMethod_ = @Autowired)
	WorkSpaceMapper workMapper;

	@Setter(onMethod_ = @Autowired)
	HistoryService historyService;

	@Setter(onMethod_ = @Autowired)
	PageService pageService;

	// 워크스페이스 생성
	@Override
	@Transactional
	public String insertWorkspace(WorkSpaceVO workVO) {
		HistoryVO history = new HistoryVO();
		workMapper.registerWorkspace(workVO);

		history.setWorkId(workVO.getOutWid());
		history.setCreUser(workVO.getEmail());
		System.out.println(workVO.getEmail());
		history.setHistoryType("CREATE");

		historyService.insertHistory(history);

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
	public int inviteWorkspaceUser(List<WorkJoinVO> listVO) {
		for (WorkJoinVO joinVO : listVO) {
			workMapper.inviteWorkspace(joinVO);
		}
		return listVO.size();
	}

	@Override
	public List<WorkJoinVO> inviteListWorkspace(String workId) {
		return workMapper.selectInvite(workId);
	}

	@Override
	@Transactional
	public boolean editWorkspace(WorkSpaceVO workVO) {
		if (workMapper.modifyWorkspace(workVO) == 1) {
			HistoryVO history = new HistoryVO();

			history.setWorkId(workVO.getWorkId());
			history.setCreUser(workVO.getEmail());
			history.setHistoryType("UPDATE");

			historyService.insertHistory(history);

			return true;
		} else {
			return false;
		}
	}

	@Override
	@Transactional
	public boolean deleteCheckWorkspace(WorkSpaceVO workVO) {
		if (workMapper.removeCheckWorkspace(workVO) == 1) {
			HistoryVO history = new HistoryVO();

			history.setWorkId(workVO.getWorkId());
			history.setCreUser(workVO.getEmail());
			history.setHistoryType("DELETE");

			historyService.insertHistory(history);

			pageService.deleteIfWorkspace(workVO.getWorkId());
			return true;
		} else {
			return false;
		}
	}

	@Override
	public boolean assignMainPage(WorkSpaceVO workVO) {
		return workMapper.MainPgWorkspace(workVO) == 1;
	}

}