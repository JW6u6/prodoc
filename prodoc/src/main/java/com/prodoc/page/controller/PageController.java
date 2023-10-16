package com.prodoc.page.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.prodoc.block.service.BlockVO;
import com.prodoc.history.service.HistoryService;
import com.prodoc.member.service.MemberService;
import com.prodoc.member.service.MemberVO;
import com.prodoc.page.mapper.PageMapper;
import com.prodoc.page.service.PageService;
import com.prodoc.page.service.PageVO;
import com.prodoc.socket.SocketCommand;
import com.prodoc.socket.SocketVO;
import com.prodoc.user.service.UserVO;

import lombok.Setter;

@CrossOrigin
@RestController
public class PageController {
	@Autowired
	PageMapper pageMapper;

	@Autowired
	MemberService memberservice;

	@Autowired
	HistoryService historyService;

	private SimpMessagingTemplate template;

	@Autowired
	public PageController(SimpMessagingTemplate template) {
		this.template = template;
	}

	@Setter(onMethod_ = @Autowired)
	PageService pageService;

	@GetMapping("/pageList")
	public List<PageVO> pageList(@RequestParam String workId) {
		return pageMapper.pageList(workId);
	}

	@GetMapping("/findWork")
	public String findWork(@RequestParam String pageId) {
		return pageMapper.findWork(pageId);
	}

	@GetMapping("/pageInPage")
	public List<PageVO> pageInPage(@RequestParam String pageId) {
		return pageMapper.pageInPage(pageId);
	}

	@GetMapping("/pageInfo")
	public List<PageVO> pageInfo(@RequestParam String pageId) {
		return pageMapper.selectPageInfo(pageId);
	}

	@PostMapping("/pageUpdate")
	public int pageUpdate(@RequestBody PageVO pageVO) {
		return pageService.updatePage(pageVO);
	}

	@PostMapping("/inPageUpdate")
	public int inPageUpdate(@RequestBody PageVO pageVO) {
		return pageService.updateInPage(pageVO);
	}

	@PostMapping("/pagePlus")
	public int pagePlus(@RequestBody PageVO pageVO) {
		return pageService.updateNumPlus(pageVO);
	}

	@PostMapping("/pageMinus")
	public int pageMinus(@RequestBody PageVO pageVO) {
		return pageService.updateNumMinus(pageVO);
	}

	@PostMapping("/pageInsert")
	public String pageInsert(@RequestBody PageVO pageVO, HttpSession session) {
		MemberVO memberVO = new MemberVO();
		UserVO user = (UserVO) session.getAttribute("logUser");
		memberVO.setWorkId(pageVO.getWorkId());
		List<MemberVO> list = memberservice.listMember(memberVO);
		// 해당 워크스페이스의 유저 목록을 받아서 그 중 세션로그인값(나)와 일치하는 값이 있으면 해당 워크스페이스의 멤버들 == 구독자 정함. (
		// 명령의 종류에 따른 소켓지정 = 소켓커맨드 번호)
		for (int i = 0; i < list.size(); i++) {
			if (!list.get(i).getEmail().equals(user.getEmail())) {
				System.out.println("======================//////////////");
				this.template.convertAndSendToUser(list.get(i).getEmail(), "/topic/updatePage",
						new SocketVO(SocketCommand.PAGE_CREATE, pageVO.getPageId()));
			}
		}
		return pageService.insertPage(pageVO);
	}

	// 페이지 잠금/잠금해제(소유자, 관리자 권한)
	@PostMapping("/pageLock")
	public String pageLockCheck(@RequestBody PageVO pageVO) {
		pageService.LockCheckPage(pageVO);
		return pageVO.getLockCheck();
	}

	// 페이지 삭제 체크(삭제시 삭제 체크 값이 true로 등록)
	@PostMapping("/pageDelCheck")
	public boolean pageDeleteCheck(@RequestBody PageVO pageVO, HttpSession session) {
		UserVO user = (UserVO) session.getAttribute("logUser");
		pageVO.setCreUser(user.getEmail());
		return pageService.deleteCheckPage(pageVO);
	}

	// 페이지 알림 끄기/켜기
	@PostMapping("/pageNotify")
	public int pageNotifyed(@RequestBody PageVO pageVO) {
		return pageService.notifyPage(pageVO);
	}

	// 페이지 끄기켜기알려주는거
	@GetMapping("/pageNotify")
	public int selectPageOnOff(PageVO pageVO) {
		return pageService.onOff(pageVO);
	}

	@PostMapping("/LockNotify")
	public void pageLockNoti(@RequestBody PageVO pageVO, HttpSession session) {
		UserVO user = (UserVO) session.getAttribute("logUser");
		((PageVO) pageVO).setCreUser(user.getEmail());
		pageService.LockAlam(pageVO);
	}

	// 페이지 새이름
	@GetMapping("/pageNewName")
	public String pageNewName(@RequestParam String pageId, @RequestParam String pageName, HttpSession session) {
		PageVO page = new PageVO();
		page.setPageId(pageId);
		page.setPageName(pageName);

		BlockVO history = new BlockVO();
		history.setWorkId(pageMapper.findWork(pageId));
		history.setPageId(pageId);
		history.setCreUser(((UserVO) session.getAttribute("logUser")).getEmail());
		historyService.blockHistory(history);

		return pageService.newName(page);
	}

	// 페이지 복사
	@PostMapping("/pageCopyPaste")
	public String pageCopy(@RequestBody PageVO pageVO, HttpSession session) {
		return pageService.pastePage(pageVO);
	}

	// 링크 공유로 들어온 페이지...
	@GetMapping("/shared/{pageId}")
	public ModelAndView linkedPage(@PathVariable("pageId") String pageId) {
		ModelAndView modelview = new ModelAndView();
		List<PageVO> listVO = pageMapper.selectPageInfo(pageId);

		for (PageVO pageVO : listVO) {
			modelview.setViewName("content/shareWith");
			modelview.addObject("pInfo", pageVO);
		}
		return modelview;
	}

}
