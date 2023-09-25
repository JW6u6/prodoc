package com.prodoc.block.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import com.prodoc.block.service.BlockVO;
import com.prodoc.block.service.BookMarkVO;
import com.prodoc.file.service.FileVO;

@Mapper
public interface BlockMapper {
	public List<BlockVO> selectAllBlock(BlockVO blockVO);
	public BlockVO selectBlock(BlockVO blockVO);
	public int insertBlock(BlockVO blockVO);
	public int updateBlock(BlockVO blockVO);
	public int deleteBlock(BlockVO blockVO);
	public int createCheckBlock(Map<String,String> map);
	public int createBookMark(BookMarkVO bookmarkVO);
	public int updateBookMark(BookMarkVO bookmarkVO);
	public BookMarkVO getBookMark(BookMarkVO bookmarkVO);	
	public int deleteBookMark(String id);
	public FileVO getFile(String displayId);
	public int insertFile(FileVO vo);
	public int deleteFileBlock(String displayId);
	public int updateFileBlock(FileVO vo);
}
