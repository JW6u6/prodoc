package com.prodoc.page.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.member.service.MemberService;
import com.prodoc.member.service.MemberVO;
import com.prodoc.page.mapper.PageMapper;
import com.prodoc.page.service.PageService;
import com.prodoc.page.service.PageVO;
import com.prodoc.socket.SocketVO;
import com.prodoc.user.service.UserVO;

import lombok.Setter;

@CrossOrigin
@RestController
public class PageController {
	@Autowired
	PageMapper pageMapper;
	
	@Autowired
	MemberService memberserivce;
	
    private SimpMessagingTemplate template;

    @Autowired
    public PageController(SimpMessagingTemplate template) {
        this.template = template;
    }
	
	@Setter(onMethod_ = @Autowired)
	PageService pageService;
	
	@GetMapping("/pageList")
	public List<PageVO> pageList(@RequestParam String workId){
		return pageMapper.pageList(workId);
	}
	@GetMapping("/findWork")
	public String findWork(@RequestParam String pageId){
		return pageMapper.findWork(pageId);
	}
	@GetMapping("/pageInPage")
	public List<PageVO> pageInPage(@RequestParam String pageId){
		return pageMapper.pageInPage(pageId);
	}
	@GetMapping("/pageInfo")
	public String pageInfo(PageVO pageVO) {
		return pageMapper.selectPageInfo(pageVO);
	}
	
	@PostMapping("/pageInsert")
	public String pageInsert(@RequestBody PageVO pageVO,HttpSession session ) {
		MemberVO memberVO = new MemberVO();
		UserVO user = (UserVO)session.getAttribute("logUser");
		memberVO.setWorkId(pageVO.getWorkId());
		List<MemberVO> list = memberserivce.listMember(memberVO);
		for(int i=0;i<list.size();i++) {
			if(!list.get(i).getEmail().equals(user.getEmail())) {
				System.out.println("======================//////////////");
				this.template.convertAndSendToUser(
					list.get(i).getEmail() , "/topic/updatePage", new SocketVO("pageCreate",pageVO.getPageId()));
			}
		}
		return pageService.insertPage(pageVO);
	}
	
	//페이지 잠금/잠금해제(소유자, 관리자 권한)
	@PostMapping("/pageLock")
	public String pageLockCheck(@RequestBody PageVO pageVO) {
		pageService.LockCheckPage(pageVO);
		return pageVO.getLockCheck();
	}
	
	//페이지 삭제 체크(삭제시 삭제 체크 값이 true로 등록)
	@PostMapping("/pageDelCheck")
	public void pageDeleteCheck(String pageId) {
		pageService.deleteCheckPage(pageId);
	}
	
	
	//페이지 알림 끄기/켜기
	@PostMapping("/pageNotify")
	public int pageNotifyed(@RequestBody PageVO pageVO) {
		return pageService.notifyPage(pageVO);
	}
	
}
