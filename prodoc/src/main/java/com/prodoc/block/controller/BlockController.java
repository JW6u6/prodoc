package com.prodoc.block.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	
}
