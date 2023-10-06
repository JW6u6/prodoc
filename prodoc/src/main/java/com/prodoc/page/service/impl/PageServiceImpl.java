package com.prodoc.page.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prodoc.history.service.HistoryService;
import com.prodoc.history.service.HistoryVO;
import com.prodoc.page.mapper.PageMapper;
import com.prodoc.page.service.PageService;
import com.prodoc.page.service.PageVO;

import lombok.Setter;

@Service
public class PageServiceImpl implements PageService {

	@Setter(onMethod_ = @Autowired)
	PageMapper pageMapper;

	@Autowired
	HistoryService historyService;

	// 페이지 잠금/잠금해제(소유자,관리자 권한)
	@Override
	public boolean LockCheckPage(PageVO pageVO) {
		return pageMapper.LockPage(pageVO) == 1;
	}

	// 페이지 삭제 체크(삭제시 삭제 체크 값이 true로 등록)
	@Override
	@Transactional
	public boolean deleteCheckPage(PageVO pageVO) {
		if (pageMapper.RemoveCheckPage(pageVO.getPageId()) == 1) {
			HistoryVO history = new HistoryVO();

			history.setPageId(pageVO.getPageId());
			history.setWorkId(pageVO.getWorkId());
			history.setCreUser(pageVO.getCreUser());
			history.setHistoryType("DELETE");
			
			historyService.insertHistory(history);
			
			pageMapper.RemoveChildPage(pageVO.getPageId());

			return true;
		} else {
			return false;
		}
	}

	// 페이지 알림 끄기/켜기.
	@Override
	public int notifyPage(PageVO pageVO) {
		pageMapper.onOffPage(pageVO);
		return pageVO.getResult();
	}

	@Override
	@Transactional
	public String insertPage(PageVO pageVO) {
		pageMapper.insertPage(pageVO);
		HistoryVO history = new HistoryVO();
		history.setWorkId(pageVO.getWorkId());
		history.setCreUser(pageVO.getCreUser());
		history.setHistoryType("CREATE");

		if (pageVO.getInsertResult().equals("success")) {
			history.setPageId(pageVO.getPageId());
			historyService.insertHistory(history);
			return pageVO.getPageId();
		} else {
			return pageVO.getPageId();
		}
	}

	@Override
	public void deleteIfWorkspace(String workId) {
		pageMapper.ifWorkRemove(workId);
	}

}
