package com.prodoc.block.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.prodoc.block.mapper.BlockMapper;
import com.prodoc.block.service.BlockVO;
import com.prodoc.block.service.BookMarkVO;
import com.prodoc.block.service.blockfileService;
import com.prodoc.block.service.impl.BlockServiceImpl;
import com.prodoc.file.service.FileVO;
import com.prodoc.history.service.HistoryService;

/*
 * 개발자 : 이명석
 * 개발일자 : 2023/09/14
 * 
*/
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
public class BlockController {

	@Autowired
	BlockServiceImpl service;
	
	@Autowired
	blockfileService blockFileService;
	
	@Autowired
	BlockMapper mapper;
	
	@Autowired
	HistoryService historyService;
	
	//현재 워크, 현재 페이지, 로그인 유저, 해당 블럭 아이디
//	@PostMapping("block/history")
//	public void uploadHistory(@RequestBody HistoryVO histroyVO) {
//		historyMapper.blockHistory(histroyVO);
//	}
	
	@GetMapping("block/get")
	public List<BlockVO> getBlock(@RequestParam String pageId) {
		
		BlockVO block =  new BlockVO();
		
		block.setPageId(pageId);
		
		return service.selectAllBlock(block);
	}
	
	@GetMapping("block/getOne")
	public BlockVO getOneBlock(@RequestParam String displayId) {
		BlockVO block = new BlockVO();
		block.setDisplayId(displayId);
		
		
		return service.selectBlock(block);
	}
	
	@PostMapping("block/create")
	public String createBlock(@RequestBody BlockVO block) {
		//historyService.blockHistory(block); //제목에서 workId 받아와서 넣어주세요
		int result = service.createBlock(block);
		return result + "";
	}
	@PostMapping("block/update")
	public String updateBlock(@RequestBody BlockVO block) {
		System.out.println(block);
		//historyService.blockHistory(block);
		int result = service.updateBlock(block);
		System.out.println(result);
		return result +"";
	}
	@PostMapping("block/delete")
	public String deleteBlock(@RequestBody BlockVO block) {
		//historyService.blockHistory(block);
		int result = service.deleteBlock(block);
		return result+"";
	}
	
	@GetMapping("block/getMeta")
	public Map<String, String> getMeta(@RequestParam String url) {
		String parsingUrl = url;
		Document doc = null;
		System.out.println(url);
		try {
			doc = Jsoup.connect(parsingUrl).get();
			String ogTitle = doc.select("meta[property=og:title]").attr("content");
            String ogDescription = doc.select("meta[property=og:description]").attr("content");
            String ogImage = doc.select("meta[property=og:image]").attr("content");
            Map<String,String> map = new HashMap<String, String>();
            map.put("title", ogTitle);
            map.put("desc", ogDescription);
            map.put("img", ogImage);
            
            return map;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			Map<String,String> map = new HashMap<String, String>();
			map.put("error","error");
			e.printStackTrace();
			
			return map;
		}
		
	}
	
	@PostMapping("block/createBookMark")
	public String createBookMark(@RequestBody BookMarkVO vo) {
		System.out.println(vo);
		int result = service.createBookMark(vo);
		
		return result+"";
	}
	
	@PostMapping("block/updateBookMark")
	public String updateBookMark(@RequestBody BookMarkVO vo) {
		System.out.println(vo);
		int result = service.updateBookMark(vo);
		return result+"";
	}
	
	@GetMapping("block/getBookMark")
	public BookMarkVO getBookMark(BookMarkVO vo) {
		BookMarkVO map = service.getBookMark(vo);
		return map;
	}
	
	@PostMapping("block/uploadFile")
	public String UploadFile(MultipartFile file) {
		String uploadName = blockFileService.fileUploadName(file);
		System.out.println("upload--------------"+uploadName);
		return uploadName;
	}
	
	// 파일유무
	@GetMapping("block/getFile")
	public FileVO getFile(@RequestParam String displayId) {
		return service.getFile(displayId);
	}
	
	// 파일블럭이 만들어졌을때.
	@PostMapping("block/createFileBlock")
	public String createFileBlock(@RequestBody FileVO file) {
		System.out.println(file);
		int result = service.insertFile(file);
		return "";
	}
	
	// 파일블록을 등록했을때.
	@PostMapping("block/upFileBlock")
	public String updateFileBlock(@RequestBody FileVO file) {
		int result = mapper.updateFileBlock(file);
		return ""+result;
	}
	
}
