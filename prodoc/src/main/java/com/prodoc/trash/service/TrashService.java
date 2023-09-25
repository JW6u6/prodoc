package com.prodoc.trash.service;

import java.util.List;

import com.prodoc.history.service.HistoryVO;

public interface TrashService {
	List<HistoryVO> getTrash(TrashVO trash);
	int revokeTrash(HistoryVO history);
}
