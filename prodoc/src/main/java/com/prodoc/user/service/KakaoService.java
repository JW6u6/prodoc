package com.prodoc.user.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KakaoService {
	@Value("${kakao.client.id}")
    private String KAKAO_CLIENT_ID;

    @Value("${kakao.client.secret}")
    private String KAKAO_CLIENT_SECRET;

    @Value("${kakao.redirect.url}")
    private String KAKAO_REDIRECT_URL;

    private final static String KAKAO_AUTH_URI = "https://kauth.kakao.com";
    private final static String KAKAO_API_URI = "https://kapi.kakao.com";

    public String getKakaoLogin() {
        return KAKAO_AUTH_URI + "/oauth/authorize"
                + "?client_id=" + KAKAO_CLIENT_ID
                + "&redirect_uri=" + KAKAO_REDIRECT_URL
                + "&response_type=code";
    }
    
    public UserVO getKakaoInfo(String code) throws Exception {
    	//컨트롤러에서 리턴받은 인증 코드값을 통해 카카오 인증 서버에 액세스 토큰을 요청
        if (code == null) throw new Exception("Failed get authorization code");

        String accessToken = "";
        String refreshToken = "";

        try {
            HttpHeaders headers = new HttpHeaders();
	        headers.add("Content-type", "application/x-www-form-urlencoded");

	        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
	        params.add("grant_type"   , "authorization_code");
	        params.add("client_id"    , KAKAO_CLIENT_ID);
	        params.add("client_secret", KAKAO_CLIENT_SECRET);
	        params.add("code"         , code);
	        params.add("redirect_uri" , KAKAO_REDIRECT_URL);

	        RestTemplate restTemplate = new RestTemplate();
	        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(params, headers);

	        ResponseEntity<String> response = restTemplate.exchange(
	        		KAKAO_AUTH_URI + "/oauth/token",
	                HttpMethod.POST,
	                httpEntity,
	                String.class
	        );
	        
	        //Response 데이터 파싱
	        ObjectMapper om = new ObjectMapper();
	        Map<String, String> jsonObj = om.readValue(response.getBody(), Map.class);

            accessToken  = jsonObj.get("access_token");
            refreshToken = jsonObj.get("refresh_token");
        } catch (Exception e) {
            throw new Exception("API call failed");
        }

        return getUserInfoWithToken(accessToken);
    }

    private UserVO getUserInfoWithToken(String accessToken) throws Exception {
    	//전달받은 액세스 토큰을 통해 사용자 정보 get
    	
        //HttpHeader 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        //HttpHeader 담기
        RestTemplate rt = new RestTemplate();
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = rt.exchange(
                KAKAO_API_URI + "/v2/user/me",
                HttpMethod.POST,
                httpEntity,
                String.class
        );
        
        //Response 데이터 파싱
        ObjectMapper om = new ObjectMapper();
        Map<String, Object> jsonObj = om.readValue(response.getBody(), Map.class);
        Map<String, Object> account = (Map<String, Object>) jsonObj.get("kakao_account");
        Map<String, Object> prof = (Map<String, Object>) account.get("profile");
        
        UserVO user = new UserVO();
        user.setEmail(String.valueOf(account.get("email")));
        user.setNickname(String.valueOf(prof.get("nickname")));
        user.setProfile(String.valueOf(prof.get("profile_image_url")));
        user.setPlatform("KAKAO");
        return user;
    }
}
