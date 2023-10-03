package com.prodoc.user.service;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KakaoVO {
	long id;
    String email;
    String nickname;
    String profile;
    String birthday;
}
