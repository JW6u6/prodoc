package com.prodoc.socket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Controller
public class SocketController {
	
	@Autowired
	SimpMessagingTemplate temp; 

//Ajax랑 비슷함 /updateCmd라는 주소에 명령요청을 매핑.
//  주소를 받음 > SendTo(updatePage를 구독한 사람목록)에게 명령요청 함. 
//   > socketVO를 리턴함(명령 종류) 기능의구조를 정해둔다 생각
  @MessageMapping("/updateCmd") // 메세지 경로 매핑
  @SendTo("/topic/updatePage")  // 
  public SocketVO greeting(SocketVO socketVO) throws Exception {
	  Thread.sleep(1000); // simulated delay
	  return socketVO;
  }
  //워크스페이스 invite
  @MessageMapping("/inviteCmd")
  @SendTo("/topic/inviteWork")
  public SocketVO invite(SocketVO socketVO) throws Exception {
	  Thread.sleep(1000);
	  return socketVO;
  }
  //테스트
  @MessageMapping("/collaboration/{pageId}")
  @SendTo("/topic/collaboration/{pageId}")
  public String tset(@DestinationVariable String pageId, String string) throws InterruptedException {
	  Thread.sleep(1000);
	  System.out.println(pageId+""+string);
	  return string;
  }
}