package com.prodoc.socket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SocketController {


  @MessageMapping("/updateCmd")
  @SendTo("/topic/updatePage")
  public SocketVO greeting(SocketVO socketVO) throws Exception {
    Thread.sleep(1000); // simulated delay
    return socketVO;
  }

}