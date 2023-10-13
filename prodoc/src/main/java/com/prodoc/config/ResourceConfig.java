package com.prodoc.config;

import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ResourceConfig implements WebMvcConfigurer {
	@Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
	
        registry.addResourceHandler("/download/**")
        .addResourceLocations("file:///C:/image/")      
        .setCacheControl(CacheControl.maxAge(1, TimeUnit.MINUTES)); // 접근 파일 캐싱 시간 
        
        registry.addResourceHandler("/files/**")
        .addResourceLocations("file:///c:/prodoc/image/profile/");
        
        registry.addResourceHandler("/block/files/**")
        .addResourceLocations("file:///c:/prodoc/image/block/");
    }
}
