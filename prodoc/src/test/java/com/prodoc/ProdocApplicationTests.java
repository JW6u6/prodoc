package com.prodoc;

import org.jasypt.encryption.StringEncryptor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.prodoc.workspace.service.WorkSpaceService;
import com.prodoc.workspace.service.WorkSpaceVO;

@SpringBootTest
class ProdocApplicationTests {

//	@Autowired
//	StringEncryptor jasyptStringEncryptor;
//	@Test
//	void contextLoads() {
//		String[] datas = {""};
//		
//		for(String data : datas) {
//			String enyData = jasyptStringEncryptor.encrypt(data);
//			System.out.println(enyData);
//		}
//	}
	
	@Autowired
	StringEncryptor jasyptStringEncryptor;
	
	@Test
	public void insertTest(){
		WorkSpaceVO vo = new WorkSpaceVO();
		//, , , 
		vo.setWorkType("PERSONAL");
		vo.setWorkName("서비스 테스트");
		vo.setPublicCheck("PUBLIC");
		vo.setEmail("serviceTest@naver.com");
	}

}
