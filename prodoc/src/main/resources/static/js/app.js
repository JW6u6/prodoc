//메인이 될 IP 주소 설정
const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8099/websocket'
});
connect();
//해당 updatePage를 구독중인 사람
stompClient.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/user/topic/updatePage', (data) => {
        let socketVO = JSON.parse(data.body);
        if(socketVO.cmd == 1){
            console.log("생성완료");
        }
    });
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

