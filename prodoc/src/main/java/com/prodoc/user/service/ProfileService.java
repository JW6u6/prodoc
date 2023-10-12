package com.prodoc.user.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileService {
	@Value("${file.upload.path}")
	private String uploadPath; //업로드 경로(propertise에 정의) => c:/prodoc/image/profile
	
	public String fileUploadName(MultipartFile mfile) {
		String uploadName = "";
		if(mfile != null && mfile.getSize() > 0) { //이미지 등록을 했음
			File file = new File(uploadPath);
			if(!file.exists()) {						//지정된 파일 경로의 디렉토리가 없으면 생성함
				if (file.mkdirs() == true) { 		//중첩된 폴더를 모두 생성해주는 메소드 mkdirs
			    	System.out.println("디렉토리가 생성되었습니다."); 
			    }
			}
			 
			String originalName = mfile.getOriginalFilename(); //오리지널 파일 이름
			Date localdate = new Date(); 
			uploadName = Long.toString(localdate.getTime()) + originalName; 	//유니크 파일 네임
			Path savePath = Paths.get(uploadPath + File.separator + uploadName);	//저장 경로
			
			try {
				mfile.transferTo(savePath); //지정 경로로 파일 업로드
			} catch (IllegalStateException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			System.out.println("mfile: " + mfile);					//mfile: org.springframework.web.multipart.support.StandardMultipartHttpServletRequest$StandardMultipartFile@51ec2087
			System.out.println("originalName: " + originalName);	//originalName: img4.jpg
			System.out.println(uploadName);							//1694761782169img6.jpg
			System.out.println(savePath);							//c:\prodoc\image\profile\1694761782169img6.jpg
		}
		return uploadName;
	}
}
