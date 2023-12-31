//메인이 될 IP 주소 설정
const stompClient = new StompJs.Client({
  brokerURL: "ws://15.164.0.219:8099/websocket",
});
console.log(stompClient);
connect();  

//해당 updatePage를 구독중인 사람
stompClient.onConnect = (frame) => {
  console.log("Connected: " + frame);
  // 페이지 업데이트
  stompClient.subscribe("/user/topic/updatePage", (data) => {
    let socketVO = JSON.parse(data.body);
    console.log(data);
    console.log(socketVO);
    console.log(typeof socketVO.cmd);
    if (socketVO.cmd == 1) {
      console.log("생성완료");
      if (document.querySelector("#alarmModal").className == "hide") {
        //알림 모달이 닫혀있을 때 사이드(알림) 노란줄
        document.querySelector("#alarm").style.backgroundColor = "yellow";
      } else {
        //알림이 열려 있을 때 목록 다시 불러오기
        showAlarmList("all");
      }
    } else if (socketVO.cmd == 3) {
      console.log("업데이트");
      allList();
      if (document.querySelector("#alarmModal").className == "hide") {
        //알림 모달이 닫혀있을 때 사이드(알림) 노란줄
        document.querySelector("#alarm").style.backgroundColor = "yellow";
      } else {
        //알림이 열려 있을 때 목록 다시 불러오기
        showAlarmList("all");
      }
    }
  });

  //초대
  stompClient.subscribe("/user/topic/inviteWork", (data) => {
    let socketVO = JSON.parse(data.body);
    if (socketVO.cmd == 2) {
      console.log(data);
      console.log(data.body);
      console.log(socketVO); //socketVO.connect = 초대받은 workId
      if (document.querySelector("#alarmModal").className == "hide") {
        //알림 모달이 닫혀있을 때 사이드(알림) 노란줄
        document.querySelector("#alarm").style.backgroundColor = "yellow";
      } else {
        //알림이 열려 있을 때 목록 다시 불러오기
        showAlarmList("all");
      }
    }
  });

  // 테스트
};
//sendSocketEvent -> publish function

stompClient.onWebSocketError = (error) => {
  console.error("Error with websocket", error);
};

stompClient.onStompError = (frame) => {
  console.error("Broker reported error: " + frame.headers["message"]);
  console.error("Additional details: " + frame.body);
};

stompClient.onclose = function (event) {
  console.log("Disconnected");
  const socketDataObj = {
    eventType: "disconnect",
    who: blockSessionUserId,
  };
  sendSocketEvent(socketDataObj);
};

function connect() {
  stompClient.activate();
}

function disconnect() {
  stompClient.deactivate();
}
// 각자 만들기

async function sideDragEvent(targetItem, dragItem) {
  const order = targetItem.dataset.blockOrder;
  const temp = await updateTemplate({
    displayId: null,
    type: "COLUMN",
    order,
  });
  targetItem.insertAdjacentHTML("afterend", temp.template);
  const columnBlock = document.querySelector(
    `[data-block-id="${temp.displayId}"]`
  );
  // 새로만든 컬럼의 컨텐츠영역
  const content = columnBlock.querySelector(".content");
  // 컨텐츠에 이벤트 등록
  handlingBlockEvent(columnBlock);
  // 컬럼에 값을 넣기
  content.appendChild(targetItem);
  content.appendChild(dragItem);
}

function dragEvent({ targetItem, dragItem, dragState, targetType }) {
  console.log("event.");
  console.log(dragState);
  let newOrder = null;
  const targetContent = targetItem.querySelector(".content");
  const targetBlockOrder = Number(targetItem.dataset.blockOrder);
  console.log(targetItem);
  console.log(targetItem.previousElementSibling);
  // 드래그상태에 따른 작업
  if (targetContent.classList.contains("toggle_block")) {
    parentId = toggleEvent(targetItem, dragItem);
  } else if (dragState === DRAG_STATE.TOP) {
    if (targetItem.previousElementSibling) {
      const prevTarget = Number(
        targetItem.previousElementSibling.dataset.blockOrder
      );
      console.log("prev:", prevTarget, "target:", targetBlockOrder);
      newOrder = (targetBlockOrder + prevTarget) / 2;
      console.log(newOrder);
    } else {
      // 맨 앞
      newOrder = targetBlockOrder / 2;
    }
    targetItem.parentElement.insertBefore(dragItem, targetItem);
  } else if (
    dragState === DRAG_STATE.BOTTOM ||
    dragState === DRAG_STATE.LSIDE
  ) {
    if (targetType === "TOGGLE") {
      console.log(targetType);
      // toggleEvent(targetItem, dragItem);
    } else {
      if (targetItem.nextElementSibling) {
        const nextTarget = Number(
          targetItem.nextElementSibling.dataset.blockOrder
        );
        newOrder = (targetBlockOrder + nextTarget) / 2;
      } else {
        // 맨 뒤
        newOrder = targetBlockOrder + 1024;
      }
      insertAfter(dragItem, targetItem);
    }
  } else if (dragState === DRAG_STATE.RSIDE) {
    sideDragEvent(targetItem, dragItem);
  }
  dragItem.dataset.blockOrder = newOrder;
}

async function changeEvent(blockId, blockType) {
  let targetBlock = document.querySelector(`[data-block-id="${blockId}"]`);
  // 바꾸려는 블럭의 값
  let text = "";
  const content = targetBlock.querySelector(".content");

  // 블럭 변경시 색을 유지해야함
  let colorArr = null;
  if (content) {
    text = content.innerHTML;
    const contentClassList = content.classList;
    colorArr = [...contentClassList].filter((word) => word !== "content");
  }

  // 해당 블럭의 순서
  const order = targetBlock.dataset.blockOrder;

  const blockChangeObj = {
    displayId: blockId,
    type: blockType,
    text: blockType === "VIDEO" ? "" : text,
    order,
  };
  //블럭 템플릿 만들기
  const block = await updateTemplate(blockChangeObj);

  //바꾼 블럭을 붙이기
  targetBlock.insertAdjacentHTML("afterend", block.template);
  targetBlock.remove();
  targetBlock = document.querySelector(`[data-block-id="${blockId}"]`);

  //색입히기
  colorArr.forEach((cls) => {
    const targetContent = targetBlock.querySelector(".content");
    targetContent.classList.add(cls);
  });
  handlingBlockEvent(targetBlock);
}
