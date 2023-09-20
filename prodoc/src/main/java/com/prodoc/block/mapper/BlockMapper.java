package com.prodoc.block.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import com.prodoc.block.service.BlockVO;

@Mapper
public interface BlockMapper {
	public List<BlockVO> selectAllBlock(BlockVO blockVO);
	public int insertBlock(BlockVO blockVO);
	public int updateBlock(BlockVO blockVO);
	public int deleteBlock(BlockVO blockVO);
	public int createCheckBlock(Map<String,String> map);
	public int createBookMark(String displayId);
	public int updateBookMark(Map<String,String> map);
	public String getBookMark(String displayId);
	public int deleteBookMark(String displayId);
}
