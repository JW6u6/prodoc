package com.prodoc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {	
		//세부 설정
		http.authorizeHttpRequests(
        		(authz) -> {	
        			authz.antMatchers("/", "/join","/joinout", "/login", "/block/**").permitAll();//이 페이지는 인증X
        			authz.anyRequest().authenticated();			//그 외 모든 페이지 인증O?
        			});
		
		//로그인 처리 설정
        http.formLogin().loginPage("/")		//접근이 허락되지 않은 페이지에 접근 했을 경우 커스텀 로그인 페이지로 이동
        	.loginProcessingUrl("/login")	//"/login" 호출 시 로그인 실행
        	.usernameParameter("email") 	// 사용자아이디 파라미터명
            .passwordParameter("password") 	// 비밀번호 파라미터명
            //.defaultSuccessUrl("/home")		//로그인 성공 시 이동 url *AuthSuccessHandler가 있으면 동작하지 않음
            .successHandler(customAuthSuccessHandler()) // 로그인 성공 후 별도의 처리를 위한 핸들러
            .failureHandler(customAuthFailureHandler()) // 로그인 실패 후 별도의 처리를 위한 핸들러
            
            .and().logout()
            .logoutUrl("/logout")			//해당 url로 접근 시 로그아웃 실행
            .logoutSuccessUrl("/")			//로그아웃 시 이동 페이지 경로
            .invalidateHttpSession(true).deleteCookies("JSESSIONID") 	//로그아웃 시 세션과 쿠키를 지움
        	
            .and().csrf().disable(); //csrf 토큰을 비활성화: ajax 통신 가능
        return http.build();
	}
	
	@Bean
    AuthenticationSuccessHandler customAuthSuccessHandler(){
        return new AuthSuccessHandler();	//로그인 성공 커스텀 핸들러
    }
	@Bean
    AuthenticationFailureHandler customAuthFailureHandler(){
        return new AuthFailureHandler();	//로그인 실패 커스텀 핸들러
    }
	 
	@Bean
    public WebSecurityCustomizer webSecurityCustomizer() {//인증 없이 접속 가능한 경로 (인증없이 리소스 이용가능)
        return (web) -> web.ignoring().antMatchers( "/files/**", "/css/**", "/js/**", "/images/**");
	}
	
	@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); //암호화에 필요한 객체를 스프링 빈으로 등록
    }
}
