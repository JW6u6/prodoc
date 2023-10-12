package com.prodoc.workspace.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.prodoc.notify.service.NotifyResultVO;
import com.prodoc.notify.service.NotifyService;
import com.prodoc.page.service.PageService;
import com.prodoc.socket.SocketCommand;
import com.prodoc.socket.SocketVO;
import com.prodoc.user.service.UserService;
import com.prodoc.user.service.UserVO;
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

	@Autowired
	NotifyService notifyService;
	
	@Setter(onMethod_ = @Autowired)
	WorkSpaceMapper WorkSpaceMapper;

	@Setter(onMethod_ = @Autowired)
	WorkSpaceService workspaceService;

	@Setter(onMethod_ = @Autowired)
	PageService pageService;
	
	@Autowired	
	UserService userService;	
	
	private SimpMessagingTemplate template;

	@Autowired
	public WorkSpaceController(SimpMessagingTemplate template) {
		this.template = template;
	}
	
	// 사이드바에 워크스페이스 목록 출력
	@GetMapping("/workList")
	public List<WorkSpaceVO> workList(String email) {
		return WorkSpaceMapper.workList(email);
	}

	@GetMapping("/workId")
	public String workId(String workName) {
		return WorkSpaceMapper.workId(workName);
	}

	// 워크스페이스 단건 조회
	@GetMapping("/workInfo")
	public WorkSpaceVO workInfo(String workId) {

		return workspaceService.infoWorkspace(workId);
	}

	// 워크스페이스 새로 생성
	@PostMapping("/workInsert")
	public String workspaceInsert(@RequestBody WorkSpaceVO workVO) {
		// 워크스페이스 생성
		return workspaceService.insertWorkspace(workVO);
		// 워크스페이스 생성할때 유저 초대하는 경우 리턴으로 받아온 워크스페이스 아이디를 넘김.
	}

	// 워크스페이스 유저 초대
	@PostMapping("/workJoin")
	public int workspaceJoin(@RequestBody List<WorkJoinVO> joinVO) {
		int result = workspaceService.inviteWorkspaceUser(joinVO);	//초데 테이블에 등록		
		for (int i = 0; i < joinVO.size(); i++) {
			UserVO find = new UserVO();
			find.setEmail(joinVO.get(i).getInviteEmail());
			UserVO user = userService.getUser(find);
			System.out.println(user + "================================");
			if(user != null) {	
				this.template.convertAndSendToUser(
						user.getEmail(), "/topic/inviteWork",
						new SocketVO(SocketCommand.WORK_INVITE, ""));			
			}
		}
		//알람 리스트 리로드
		
		return result;
	}

	// 워크스페이스 초대한 유저 리스트
	@GetMapping("/joinList")
	public List<WorkJoinVO> inviteList(String workId) {
		return workspaceService.inviteListWorkspace(workId);
	}

	// 워크스페이스 수정
	@PostMapping("/workEdit")
	public void workspaceEdit(@RequestBody WorkSpaceVO workVO) {
		workspaceService.editWorkspace(workVO);
	}

	// 워크스페이스 삭제(삭제시 삭제 체크 값이 true로 등록)
	@PostMapping("/workDelete")
	public void workspaceDeleteCheck(@RequestBody WorkSpaceVO workVO) {
		workspaceService.deleteCheckWorkspace(workVO);
	}

	// 워크스페이스 메인 페이지 지정
	@PostMapping("/workMainPg")
	public boolean workspaceMainPage(@RequestBody WorkSpaceVO workVO) {
		return workspaceService.assignMainPage(workVO);
	}

	@GetMapping("/invite/{inviteId}")
	public void mappingPath(@PathVariable("inviteId") String inviteId, RedirectAttributes rttr, HttpServletResponse response) {
		WorkSpaceVO workVO = WorkSpaceMapper.InviteWorkInfo(inviteId);// 인바이트 아이디로 워크 아이디 찾기
		System.out.println(workVO);
		String mainP = workVO.getMainPageId();// 워크 아이디로 메인 페이지 찾기
		// 메인 페이지 아이디 모달에 담아 전송
		rttr.addAttribute("pageId", mainP);
		try {
			response.sendRedirect("/shareWith?pageId="+ mainP);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
