package com.prodoc.config;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ResourceConfig implements WebMvcConfigurer {
	@Value("${file.upload.resource.path}")
	private String profilePath; //업로드 경로(propertise에 정의) => c:/prodoc/image/profile
	
	@Value("${block.file.upload.resource.path}")
	private String blockPath;
	
	@Value("${dbattr.file.upload.resource.path}")
	private String dbattrPath;
	
	@Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
	
        registry.addResourceHandler("/download/**")
        .addResourceLocations("file:///C:/image/")      
        .setCacheControl(CacheControl.maxAge(1, TimeUnit.MINUTES)); // 접근 파일 캐싱 시간 
        
        registry.addResourceHandler("/files/**")
        .addResourceLocations(profilePath);
        

        registry.addResourceHandler("/dbFiles/**")
        .addResourceLocations(dbattrPath);

        registry.addResourceHandler("/block/files/**")
        .addResourceLocations(blockPath);

    }
}
