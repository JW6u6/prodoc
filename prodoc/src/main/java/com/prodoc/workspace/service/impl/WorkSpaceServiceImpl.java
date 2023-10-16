package com.prodoc.workspace.service.impl;

import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prodoc.history.service.HistoryService;
import com.prodoc.history.service.HistoryVO;
import com.prodoc.page.service.PageService;
import com.prodoc.workspace.mapper.WorkSpaceMapper;
import com.prodoc.workspace.service.WorkJoinVO;
import com.prodoc.workspace.service.WorkSpaceService;
import com.prodoc.workspace.service.WorkSpaceVO;
import com.prodoc.workspace.service.allListVO;

import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Service
@RequiredArgsConstructor
public class WorkSpaceServiceImpl implements WorkSpaceService {

	@Setter(onMethod_ = @Autowired)
	WorkSpaceMapper workMapper;

	@Setter(onMethod_ = @Autowired)
	HistoryService historyService;

	@Setter(onMethod_ = @Autowired)
	PageService pageService;

	@Autowired
	private final JavaMailSender jmSender;
	
	@Override
	public List<allListVO> allList(String email){
		
		return workMapper.allList(email);
	}

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
	@Transactional
	public int inviteWorkspaceUser(List<WorkJoinVO> listVO) {
		for (WorkJoinVO joinVO : listVO) {
			workMapper.inviteWorkspace(joinVO);

			WorkSpaceVO workVO = workMapper.selectOneWorkspace(joinVO.getWorkId());
			MimeMessage msg = jmSender.createMimeMessage();

			String url = "<div>"//
					+ "<h1>PRODOC 워크스페이스에 초대되었습니다.</h1>"//
					+ "<br>"//
					+ "<p>링크를 클릭하여"//
					+ "<a href=\"http://prodox.me/invite/" + joinVO.getInviteId()
					+ "\"> → 워크스페이스 구경가기</a></p></div>";
			try {
				msg.addRecipient(RecipientType.TO, new InternetAddress(joinVO.getInviteEmail()));
				msg.setSubject("PRODOC: " + workVO.getWorkName() + " 워크스페이스에 초대되셨습니다.");
				msg.setText(url, "utf-8", "html");
			} catch (MessagingException e) {
				e.printStackTrace();
			}

			jmSender.send(msg);
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