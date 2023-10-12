const blocks = document.querySelectorAll(".prodoc_block");
const container = document.querySelector(".container");
let blockCount = 1;

container.addEventListener("dragover", (e) => {
  e.preventDefault();
});

container.addEventListener("drop", (e) => {
  let newOrder = null;
  let isColumn = null;
  const pointer = document.querySelector(".block_pointer");
  const target = pointer.closest(".prodoc_block");
  const dragItem = document.querySelector(".dragging").closest(".prodoc_block");
  //만약 드래그된애가 컬럼블럭에 있다면 이 블럭을 주시.
  if (dragItem.parentElement.classList.contains("block_column")) {
    isColumn = dragItem.parentElement;
  }
  insertAfter(dragItem, target);
  newOrder = Number(target.dataset.blockOrder) + 1024;
  dragItem.dataset.blockOrder = newOrder;
  const updateObj = {
    upUser: blockSessionUserId,
    displayId: dragItem.dataset.blockId,
    rowX: dragItem.dataset.blockOrder,
  };
  if (isColumn && isColumn.children.length <= 0) {
    const block = isColumn.closest(".prodoc_block");
    deleteBlock(block);
  }
  updateDBBlock(updateObj);
  if (pointer) {
    pointer.remove();
  }
});

//컨테이너 클릭 이벤트
container.addEventListener("mouseup", (e) => {
  let newElement = null;
  if (e.target !== e.currentTarget) return;
  e.stopPropagation();
  const paddingBottom = 150;
  const targetHeight = e.target.clientHeight;
  const clickHeight = e.offsetY;
  const prevBlock = e.target.lastElementChild;
  if (targetHeight - paddingBottom < clickHeight && prevBlock !== null) {
    const isSeparator = prevBlock.querySelector(".separator");
    if (isSeparator) return;
    if (prevBlock.querySelector(".content").innerHTML.length !== 0) {
      const template = makeBlockTemplate();
      const displayObj = {
        template,
        type: null,
        element: null,
      };
      displayBlock(displayObj); // 문서쪽으로 만듦
    }
  } else {
    const template = makeBlockTemplate();
    const displayObj = {
      template,
      type: null,
      element: null,
    };
    displayBlock(displayObj); // 문서쪽으로 만듦
  }
});

// 드래그를 끝냈을때
function dragend_handler(event) {
  event.target.classList.remove("dragging"); // 드래그가 끝났으므로 삭제.
}

function dragStart(event) {
  event.target.classList.add("dragging"); // 드래그중인 요소를 알기위해 클래스 지정
  event.dataTransfer.dropEffect = "copy"; //드래그중 마우스 커서 모양을 정하기
}

// 사이드면 state를 side, 위면 top 아래면 bottom.
let dragState = null;
let dragovertarget = null;

const DRAG_STATE = {
  RSIDE: "RSIDE",
  LSIDE: "LSIDE",
  TOP: "TOP",
  BOTTOM: "BOTTOM",
};

// dragover 핸들러
function dragover_handler(event) {
  //dragover의 기본 동작 막기 (drop을 위한 작업)
  event.preventDefault();
  event.stopPropagation();

  //드래그중 마우스 커서 모양을 정하기
  event.dataTransfer.dropEffect = "move";

  //블럭을 조작하기위한 선언
  const targetItem = event.currentTarget;
  const dragItem = document.querySelector(".dragging").closest(".prodoc_block");
  const targetHeight = targetItem.offsetHeight;
  const targetWidth = targetItem.offsetWidth;
  const center = targetHeight / 2;
  const rSide = targetWidth - 50;
  const lSide = targetWidth - targetWidth * 0.9;

  // 부모 좌표를 계산해서 선언
  const rect = targetItem.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  // 같은 블럭이면 반응하지않음.
  if (targetItem === dragItem) return;

  // 다른 블럭이면 dragState 초기화.
  if (dragovertarget !== event.currentTarget) {
    dragState = null;
  }
  dragovertarget = event.currentTarget;

  const type = targetItem.dataset.blockType;

  // 빨간줄을 그어주는 조건문
  if (offsetX > rSide) {
    // 오른쪽 사이드
    if (dragState !== DRAG_STATE.RSIDE) {
      dragState = DRAG_STATE.RSIDE;
      blockPointerEvent(targetItem, dragState);
    }
  } else if (offsetY > center) {
    // 아래쪽
    if (offsetX < lSide && dragState !== DRAG_STATE.LSIDE) {
      // 왼쪽 사이드
      dragState = DRAG_STATE.LSIDE;
      blockPointerEvent(targetItem, DRAG_STATE.BOTTOM);
    } else if (
      offsetX < rSide &&
      offsetX > lSide &&
      dragState !== DRAG_STATE.BOTTOM
    ) {
      // 아래
      dragState = DRAG_STATE.BOTTOM;
      if (type === "TOGGLE") {
        console.log("hi");
        blockPointerEvent(targetItem, dragState, "BLUE");
      } else {
        blockPointerEvent(targetItem, dragState);
      }
    }
  } else if (offsetY < center) {
    // 위쪽
    if (offsetX < rSide && dragState !== DRAG_STATE.TOP) {
      dragState = DRAG_STATE.TOP;
      blockPointerEvent(targetItem, dragState);
    }
  }
}

// 토글 이벤트
function toggleEvent(targetItem, dragItem) {
  let parentId = null;
  const toggleTarget = targetItem;
  const list = toggleTarget.querySelector(".child_item");
  const childBlockList = list.querySelectorAll(".prodoc_block");
  let count = childBlockList.length;
  newOrder = (count + 1) * 1024;
  dragItem.dataset.blockOrder = newOrder;
  list.appendChild(dragItem);
  parentId = targetItem.dataset.blockId;
  return parentId;
}

// 새로만든 drophandler. 바뀐게 있나?
async function drop_handler(event) {
  event.stopPropagation();
  let parentId = null;
  let newOrder = null;
  let isColumn = null;
  // 포인터를 제거
  const pointer = document.querySelector(".block_pointer");
  if (pointer) {
    pointer.remove();
  }
  const dragItem = document.querySelector(".dragging").closest(".prodoc_block");
  const targetItem = event.currentTarget;
  const targetContent = event.target;
  const targetType = targetItem.dataset.blockType;
  const targetBlockOrder = Number(targetItem.dataset.blockOrder);
  const targetBlockId = targetItem.dataset.blockId;
  const dragBlockId = dragItem.dataset.blockId;

  const socketEventObj = {
    eventType: "DRAG",
    targetBlockId,
    dragBlockId,
    dragState,
    upUser: blockSessionUserId,
  };
  socketEventObj(socketEventObj);

  if (document.querySelector(".dragging").classList.contains("db_block"))
    return;
  if (event.target.nodeName === "IMG") return;

  //만약 드래그된애가 컬럼블럭에 있다면 이 블럭을 주시.
  if (dragItem.parentElement.classList.contains("block_column")) {
    isColumn = dragItem.parentElement;
  }
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
    const isColumn = targetItem.closest(".child_item");
    if (isColumn) {
      const block = isColumn.closest(".prodoc_block");
      const blockId = block.dataset.blockId;
      insertAfter(dragItem, targetItem);
      updateDBBlock({
        displayId: dragItem.dataset.blockId,
        rowX: 2048,
        parentId: blockId,
      });
      updateDBBlock({
        displayId: targetItem.dataset.blockId,
        rowX: 1024,
        parentId: blockId,
      });
      return;
    }
    //컬럼의 컬럼을 막기
    if (targetItem.dataset.blockType === "COLUMN") return;
    // 사이드 이동시 새로운 컬럼이라는 블럭을 생성.
    const order = targetItem.dataset.blockOrder;
    // 새로운 템플릿 컬럼
    const temp = await updateTemplate({
      displayId: null,
      type: "COLUMN",
      order,
    });
    targetItem.insertAdjacentHTML("afterend", temp.template);
    const columnBlock = document.querySelector(
      `[data-block-id="${temp.displayId}"]`
    );
    //새로만든 컬럼
    // 부모가 있다면
    const isParent = columnBlock.parentElement.closest(".prodoc_block");
    // 새로만든 컬럼의 컨텐츠영역
    const content = columnBlock.querySelector(".content");
    // 컨텐츠에 이벤트 등록
    handlingBlockEvent(columnBlock);
    // 컬럼에 값을 넣기
    content.appendChild(targetItem);
    content.appendChild(dragItem);
    //컬럼블럭 자체를 데이터 베이스에 insert
    //만약 컬럼블럭이 부모가 있는 블럭쪽에 위치해있다면 parentId를 넣어주기. 아니면 parentId = null
    if (columnBlock.parentElement.classList.contains("child_item")) {
      createDBBlock({
        blockId: "COLUMN",
        creUser: blockSessionUserId,
        pageId: workBlockId,
        rowX: order,
        displayId: temp.displayId,
        parentId: isParent.dataset.blockId,
      });
    } else {
      createDBBlock({
        blockId: "COLUMN",
        creUser: blockSessionUserId,
        pageId: workBlockId,
        rowX: order,
        displayId: temp.displayId,
      });
    }
    // 드래그하는 둘을 업데이트해주기위한 아이디
    const dragBlockId = dragItem.dataset.blockId;
    const targetBlockId = targetItem.dataset.blockId;
    const parentId =
      targetItem.parentElement.closest(".prodoc_block").dataset.blockId;
    // 드래그하는 블럭 부모 업데이트
    updateDBBlock({
      displayId: dragBlockId,
      parentId,
      rowX: 2048,
    });
    // 타겟블럭 부모 업데이트
    updateDBBlock({
      displayId: targetBlockId,
      parentId,
      rowX: 1024,
    });
    return;
  }

  dragItem.dataset.blockOrder = newOrder;

  // 만약 숫자가 이상하면 새로부여
  checkAndResetOrder(newOrder);

  // 드래그한게 OLIST면 OList의
  if (
    targetItem.dataset.blockType === "OLIST" ||
    dragItem.dataset.blockType === "OLIST"
  ) {
    resetOList();
  }

  // 만약 컬럼의 길이가 짧아지면
  if (isColumn && isColumn.children.length <= 0) {
    const block = isColumn.closest(".prodoc_block");
    deleteBlock(block);
  }
  const updateObj = {
    upUser: blockSessionUserId,
    displayId: dragItem.dataset.blockId,
    rowX: dragItem.dataset.blockOrder,
    parentId,
  };
  console.log(updateObj);
  updateDBBlock(updateObj);
}

/**
 * 새로 부여된 order이 비정상적일때 모든 블럭의 순서를 재할당하는 함수.
 * @param {Number} newOrder - 새로 부여된 order
 */
function checkAndResetOrder(newOrder) {
  if (!Number.isInteger(newOrder)) resetOrder();
}

// 숫자 재정렬
function resetOrder(isSocket = false) {
  // 첫번째만 검색
  const allBlock = document.querySelectorAll(".container > .prodoc_block");
  allBlock.forEach((block, index) => {
    blockOrder = (index + 1) * 1024;
    block.dataset.blockOrder = blockOrder;
    const updateObj = {
      displayId: block.dataset.blockId,
      rowX: blockOrder,
    };
    if (!isSocket) {
      updateDBBlock(updateObj);
    }
  });
  if (!isSocket) {
    const socketEventObj = {
      eventType: "RESETORDER",
    };
    socketEventObj(socketEventObj);
  }
}

//insertAfter - 요소 뒤에 삽입.
function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
