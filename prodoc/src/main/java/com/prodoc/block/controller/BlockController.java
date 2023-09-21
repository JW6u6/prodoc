package com.prodoc.block.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prodoc.block.service.BlockVO;
import com.prodoc.block.service.impl.BlockServiceImpl;

/*
 * 개발자 : 이명석
 * 개발일자 : 2023/09/14
 * 
*/
@CrossOrigin
@RestController
public class BlockController {

	@Autowired
	BlockServiceImpl service;
	
	@PostMapping("block/get")
	public List<BlockVO> getBlock(@RequestBody BlockVO block) {
		List<BlockVO> blocks = service.selectAllBlock(block);
		return blocks;
	}
	
	@PostMapping("block/create")
	public String createBlock(@RequestBody BlockVO block) {
		int result = service.createBlock(block);
		return result + "";
	}
	@PostMapping("block/update")
	public String updateBlock(@RequestBody BlockVO block) {
		int result = service.updateBlock(block);
		return result +"";
	}
	@PostMapping("block/delete")
	public String deleteBlock(@RequestBody BlockVO block) {
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
			e.printStackTrace();
		}
		
		return null;
	}
	
	@PostMapping("block/createBookMark")
	public String createBookMark(@RequestBody Map<String,String> displayId) {
		Map<String, String> map = displayId;
		String id = map.get("displayId");
		int result = service.createBookMark(id);
		
		return result+"";
	}
	
	@PostMapping("block/updateBookMark")
	public String updateBookMark(@RequestBody Map<String,String> data) {
		int result = service.updateBookMark(data);
		return result+"";
	}
	
	@GetMapping("block/getBookMark")
	public String getBookMark(@RequestParam String displayId) {
		String result = service.getBookMark(displayId);
		return result;
	}
	
	@PostMapping("block/deleteBookMark")
	public String deleteBookMark(@RequestBody Map<String,String> data) {
		String displayId = data.get("displayId");
		int result = service.deleteBookMark(displayId);
		return "";
	}
	
//	@PostMapping("block/check")
//	public String updateCheckBlock(@RequestParam String id,@RequestParam String checked) {
//		
//		Map<String, String> map = new HashMap<String, String>();
//		
//		map.put(id, checked);
//		
//		int result = service.createCheckBlock(map);
//		
//		return checked;
//		
//	}
	
}
