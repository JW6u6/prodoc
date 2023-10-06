package com.prodoc.workspace.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.prodoc.page.service.PageService;
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

	@Setter(onMethod_ = @Autowired)
	PageService pageService;

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
		int result = workspaceService.inviteWorkspaceUser(joinVO);
		return result;
	}

	// 워크스페이스 초대한 유저 리스트
	@GetMapping("/joinList")
	public List<WorkJoinVO> inviteList(String workId) {
		return workspaceService.inviteListWorkspace(workId);
	}

	@GetMapping("/invite/{inviteId}")
	public String mappingPath(@PathVariable("inviteId") String inviteId, Model model) {
	    //인바이트 아이디로 워크 아이디 찾기
		//워크 아이디로 메인 페이지 찾기
		//메인 페이지 아이디 모달에 담아 전송
		model.addAttribute("pageId", "pageId");
		return "이거 모르게썽";
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
	public void workspaceMainPage(@RequestBody WorkSpaceVO workVO) {
		workspaceService.assignMainPage(workVO);
	}

	@GetMapping("/invite/{inviteId}")
	public void mappingPath(@PathVariable("inviteId") String inviteId, Model model, HttpServletResponse response) {
		WorkSpaceVO workVO = WorkSpaceMapper.InviteWorkInfo(inviteId);// 인바이트 아이디로 워크 아이디 찾기
		String mainP = workVO.getMainPageId();// 워크 아이디로 메인 페이지 찾기
		// 메인 페이지 아이디 모달에 담아 전송
		model.addAttribute("pageId", mainP);
		try {
			response.sendRedirect("/test1");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
