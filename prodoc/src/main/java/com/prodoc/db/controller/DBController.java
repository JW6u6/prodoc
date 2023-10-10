package com.prodoc.db.controller;


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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.prodoc.block.service.BlockVO;
import com.prodoc.block.service.impl.BlockServiceImpl;
import com.prodoc.db.service.AddAttrVO;
import com.prodoc.db.service.AttrVO;
import com.prodoc.db.service.DBAttrService;
import com.prodoc.db.service.DBBlockVO;
import com.prodoc.db.service.DBCaseVO;
import com.prodoc.db.service.DBService;
import com.prodoc.db.service.DBdataVO;
import com.prodoc.db.service.PageAttrVO;
import com.prodoc.db.service.dbattrFileService;
import com.prodoc.history.service.HistoryService;
import com.prodoc.page.mapper.PageMapper;
import com.prodoc.page.service.PageVO;
import com.prodoc.user.service.UserVO;

@RestController
@Transactional
public class DBController {
	@Autowired DBService dbService;
	@Autowired DBAttrService attrService;
	@Autowired PageMapper pageMapper;
	@Autowired BlockServiceImpl blockService;
	@Autowired dbattrFileService fileService;
	@Autowired HistoryService hisService;
	
	@PostMapping("InsertDBCase")		// DBCase 페이지&블럭 생성
	public String InsertDBCase(@RequestBody DBCaseVO casePage) {
		dbService.insertDBCase(casePage);
		return casePage.getResult(); 
	}

	@GetMapping("getChildList")	// DBCase displayId로 자식요소 조회
	public Map<String, Object> getChildList(@RequestParam String parentId){
		Map<String, Object> childList = new HashMap<String, Object>();	// 반환할 하위 정보를 담은 맵
		PageVO parentVO = dbService.getDBPageInfo(parentId);				// case page의 VO 담기
		childList.put("parent", parentVO);
		List<BlockVO> blockList = dbService.getDBPageList(parentId);		// DB하위 리스트(블럭)
		for(int i=0; i<blockList.size(); i++) {							// 하위블럭의 블럭아이디로 attr, 해당pageVO 조회
			Map<String, Object> infoMap = new HashMap<String, Object>();		// 한 블럭당 가질 정보 맵
			String key = blockList.get(i).getDisplayId();
			PageVO pageVO = dbService.getDBPageInfo(key);
			List<PageAttrVO> attrList = attrService.getPageAttr(key);
			infoMap.put("block", blockList.get(i));
			infoMap.put("page", pageVO);
			infoMap.put("attrList", attrList);
			childList.put(key, infoMap);	// 하위블럭ID, 블럭정보map
		}
		System.out.println("///////////////////////////////////////////////////////");
		System.out.println(childList);
		return childList;
	}
	
	@PostMapping("updateCase")			// DBCase의 레이아웃(caseId) 변경
	public Map<String, Object> updateCase(@RequestBody PageVO page) {
		String pageId = page.getPageId();
		Map<String, Object> result = new HashMap<>();
		int num = dbService.updateCase(page);
		if(num > 0) {
			DBBlockVO dbblock = new DBBlockVO();
			dbblock.setPageId(pageId);
			result.put("result", dbService.getDBblock(dbblock));
		} else result.put("result", "fail"); 
		return result;
	}
	
	@PostMapping("insertDBpage")		// DBPage & 블럭 생성(속성을 사용하는 페이지)
	public Map<String, Object> insertDBpase(@RequestBody DBdataVO pageInfo, HttpServletRequest request){
		String displayId = pageInfo.getDisplayId();
		HttpSession session = request.getSession();
		UserVO user = (UserVO)session.getAttribute("logUser");
		pageInfo.setEmail(user.getEmail());
		Map<String, Object> result = new HashMap<>();
		String pageId = dbService.insertDBPage(pageInfo);		// 페이지 추가 => 생성된 pageId를 리턴하는 프로시저 실행
		
		BlockVO block = new BlockVO();
		block.setDisplayId(displayId);
		List<PageAttrVO> attrList = attrService.getPageAttr(displayId);
		result.put("block", blockService.selectBlock(block));
		result.put("page", dbService.getPageInfo(pageId));
		result.put("attrList", attrList);
		return result;
	}
	
	@GetMapping("getAllPageAttr")
	public List<PageAttrVO> getAllPageAttr(@RequestParam String parentId){
		List<PageAttrVO> attrList = attrService.getAllPageAttr(parentId);
		return attrList;
	}
	
	@PostMapping("displayAttrChange")
	public String displayAttrChange(@RequestBody PageAttrVO vo) {
		int result = attrService.updateDbAttr(vo);
		if(result>0) return "{\"result\" : \"success\"}";
		else return "{\"result\" : \"fail\"}";
	}
	
	@GetMapping("pageAttrList")
	public List<AttrVO> pageAttrList(){
		return attrService.pageAttrList();
	}
	
	@PostMapping("insertDbAttr")
	public String insertDbAttr(@RequestBody AddAttrVO vo) {
		attrService.insertAttr(vo);
		String result = vo.getResult();
		return "{\"caseBlock\" : \""+result+"\"}";
	}
	
	@PostMapping("deleteDbAttr")
	public void deleteDbAttr(@RequestBody PageAttrVO attrvo) {
		attrService.deletePageAttr(attrvo);
	}
	
	@PostMapping("deleteDBPage")
	public String deleteDBPage(@RequestBody BlockVO vo) {
		dbService.deleteDBPage(vo);
		return "{\"result\" : \"success\"}";
	}
	
	@PostMapping("addCalendar")
	public String addCalendar(@RequestParam PageAttrVO vo) {
		int result = attrService.addCalendar(vo);
		if(result > 0) return "{\"result\" : \"success\"}";
		else return "{\"result\" : \"fail\"}";
	}
	@PostMapping("updateAttrContent")
	public String updateAttrContent(@RequestBody PageAttrVO vo) {
		int result = attrService.updateAttrContent(vo);
		attrService.modifyDBPage(vo);
		if(result > 0) return "{\"result\" : \"success\"}";
		else return "{\"result\" : \"fail\"}";
	}
	
	@PostMapping("/dbAttr/getWorkMembers")
	public List<UserVO> getWorkMembers(@RequestBody String pageId){
		return dbService.getWorkMembers(pageId);
	}
	
	@PostMapping("insertAttrContent")
	public String insertAttrContent(@RequestBody PageAttrVO vo) {
		String pageUseId = attrService.insertAttrContent(vo);
		return "{\"result\" : \""+pageUseId+"\"}";
	}
	
	@PostMapping("deleteAttrContent")
	public void deleteAttrContent(@RequestBody PageAttrVO pageAttrVO) {
		attrService.deleteAttrContent(pageAttrVO);
	}
	
	@PostMapping("/dbattr/fileUpload")	// 파일업로드
	public String attrFileupload(MultipartFile file) {
		String uploadName = fileService.fileUploadName(file);
		return uploadName;
	}
	
	@PostMapping("/dbattr/selectAllTags")
	public List<PageAttrVO> selectAllTags(@RequestBody String dbUseId){
		return attrService.selectAllTags(dbUseId);
	}
	
	@PostMapping("modifyAttrName")
	public void modifyAttrName(@RequestBody PageAttrVO vo) {
		attrService.modifyAttrName(vo);
	}
	
	@PostMapping("attrNameUpdate")
	public void attrNameUpdate(@RequestBody PageAttrVO vo) {
		// 블럭히스토리(DB 히스토리 업데이트), attrNameUpdate()
		attrService.attrNumberUpdate(vo);
		dbService.databaseUpdate(vo);
	}
}