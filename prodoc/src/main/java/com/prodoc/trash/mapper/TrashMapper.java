package com.prodoc.trash.mapper;

import java.util.List;

import com.prodoc.history.service.HistoryVO;
import com.prodoc.trash.service.TrashResultVO;
import com.prodoc.trash.service.TrashVO;

public interface TrashMapper {
	public List<TrashResultVO> selectList(TrashVO trash);	//삭제 목록 조회
	public int revokeTrash(HistoryVO history);			//삭제 복구(단건)
}
