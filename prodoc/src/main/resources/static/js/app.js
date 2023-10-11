//메인이 될 IP 주소 설정
const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8099/websocket'
});
connect();
//해당 updatePage를 구독중인 사람

stompClient.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    // 페이지 업데이트
    stompClient.subscribe('/user/topic/updatePage', (data) => {
        let socketVO = JSON.parse(data.body);
        console.log(data)
        console.log(socketVO)
        if(socketVO.cmd == 1){
            console.log("생성완료");
        }
    });
    
     //초대
  	stompClient.subscribe("/user/topic/inviteWork", (data) => {
	    let socketVO = JSON.parse(data.body);
		if(socketVO.cmd == 2){
		    console.log(data);
		    console.log(data.body);
		    console.log(socketVO);  //socketVO.connect = 초대받은 workId
		    if(document.querySelector('#alarmModal').className == "hide"){	//알림 모달이 닫혀있을 때 사이드(알림) 노란줄
	        	document.querySelector('#alarm').style.backgroundColor = "yellow";
		    }else{	//알림이 열려 있을 때 목록 다시 불러오기
		    	showAlarmList('all');	
	    	}
	    }    
  });
    
    
    // 테스트
    
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    console.log("Disconnected");
}
// 각자 만들기


