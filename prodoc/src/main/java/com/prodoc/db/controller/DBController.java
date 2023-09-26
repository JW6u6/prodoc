package com.prodoc.db.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.block.service.BlockVO;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBService;
import com.prodoc.db.service.DBdataVO;
import com.prodoc.db.service.PageAttrVO;
import com.prodoc.page.service.PageVO;
import com.prodoc.user.service.UserVO;

@RestController
@Transactional
public class DBController {
	@Autowired
	DBService service;
	
	@PostMapping("InsertDBCase")		// DBCase 페이지&블럭 생성
	public String InsertDBCase(DBCaseVO casePage) {
		service.insertDBCase(casePage);
		return casePage.getResult();
	}

	@GetMapping("getChildList")	// DBCase displayId로 자식요소 조회
	public Map<String, Object> getChildList(@RequestParam String parentId){
		Map<String, Object> childList = new HashMap<String, Object>();	// 반환할 하위 정보를 담은 맵
		PageVO parentVO = service.getDBPageInfo(parentId);				// case page의 VO 담기
		childList.put("parent", parentVO);
		List<BlockVO> blockList = service.getDBPageList(parentId);		// DB하위 리스트(블럭)
		for(int i=0; i<blockList.size(); i++) {							// 하위블럭의 블럭아이디로 attr, 해당pageVO 조회
			Map<String, Object> infoMap = new HashMap<String, Object>();		// 한 블럭당 가질 정보 맵
			String key = blockList.get(i).getDisplayId();
			PageVO pageVO = service.getDBPageInfo(key);
			List<PageAttrVO> attrList = service.getPageAttr(key);
			infoMap.put("block", blockList.get(i));
			infoMap.put("page", pageVO);
			infoMap.put("attrList", attrList);
			childList.put(key, infoMap);	// 하위블럭ID, 블럭정보map
		}
		return childList;
	}
	
	@PostMapping("updateCase")			// DBCase의 레이아웃(caseId) 변경
	public Map<String, Object> updateCase(@RequestBody PageVO page) {
		Map<String, Object> result = new HashMap<>();
		int num = service.updateCase(page);
		if(num > 0) {
			result.put("result", "success");
		} else result.put("result", "fail");
		return result;
	}
	
	@PostMapping("insertDBpage")		// DBPage & 블럭 생성(속성을 사용하는 페이지)
	public Map<String, Object> insertDBpase(@RequestBody DBdataVO pageInfo, HttpServletRequest request){
		HttpSession session = request.getSession();
		UserVO user = (UserVO)session.getAttribute("logUser");
		pageInfo.setEmail(user.getEmail());
		Map<String, Object> result = new HashMap<>();
		String parentId = service.insertDBPage(pageInfo);
		result.put("result", parentId);
		return result;
	}
	
	@GetMapping("getAllPageAttr")
	public List<PageAttrVO> getAllPageAttr(@RequestParam String parentId){
		List<PageAttrVO> attrList = service.getAllPageAttr(parentId);
		return attrList;
	}
}