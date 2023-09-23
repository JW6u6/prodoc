package com.prodoc.db.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	
	@PostMapping("getDBPageList")		// DBCase 블럭Id로 하위 블럭 조회
	public List<BlockVO> getDBPageList(@RequestBody String parentId){
		List<BlockVO> DBList = service.getDBPageList(parentId);
		return DBList;
	}
	
	@PostMapping("getDBPageInfo")		// 하위블럭Id로 해당 블럭의 페이지정보, 속성정보 반환
	public List<Object> getDBPageInfo(@RequestBody String diplayId) {
		PageVO pageInfo = service.getDBPageInfo(diplayId);
		List<PageAttrVO> attrList = service.getPageAttr(diplayId);
		List<Object> result = new ArrayList<>();
		result.add(pageInfo);
		result.add(attrList);
		return result;
	}
	
	@PostMapping("updateCase")			// DBCase의 casId 변경
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
		int num = service.insertDBPage(pageInfo);
		if (num>0) {
			result.put("result", "success");
		} else result.put("result", "fail");
		return result;
	}
}