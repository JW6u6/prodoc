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
import com.prodoc.block.service.BookMarkVO;
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
	
	@GetMapping("block/getOne")
	public BlockVO getOneBlock(@RequestParam String displayId) {
		BlockVO block = new BlockVO();
		block.setDisplayId(displayId);
		
		
		return service.selectBlock(block);
	}
	
	@PostMapping("block/create")
	public String createBlock(@RequestBody BlockVO block) {
		int result = service.createBlock(block);
		return result + "";
	}
	@PostMapping("block/update")
	public String updateBlock(@RequestBody BlockVO block) {
		System.out.println(block);
		int result = service.updateBlock(block);
		System.out.println(result);
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
