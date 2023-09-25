const blocks = document.querySelectorAll(".prodoc_block");
const container = document.querySelector(".container");
let blockCount = 1;

container.addEventListener("dragover", (e) => {
  e.preventDefault();
});

container.addEventListener("drop", (e) => {
  let newOrder = null;
  const pointer = document.querySelector(".block_pointer");
  const target = pointer.closest(".prodoc_block");
  const dragItem = document.querySelector(".dragging").closest(".prodoc_block");
  console.log(target);
  insertAfter(dragItem, target);
  newOrder = Number(target.dataset.blockOrder) + 1024;
  dragItem.dataset.blockOrder = newOrder;
  const updateObj = {
    upUser: "pepsiman",
    displayId: dragItem.dataset.blockId,
    rowX: dragItem.dataset.blockOrder,
  };
  updateDBBlock(updateObj);
});

//컨테이너 클릭 이벤트 (click은 마우스를 클릭하고 놨을때 발생함...)
container.addEventListener("mousedown", (e) => {
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
      const temp = makeBlockTemplate();
      displayBlock(temp); // 문서쪽으로 만듦
    }
  } else {
    const temp = makeBlockTemplate();
    displayBlock(temp); // 문서쪽으로 만듦
  }
});

/**
 * 모달 뒷배경을 만들어주는 함수.
 * 클릭시 modal과 함께 제거됨
 * @param {Element} modal - 화면에 보여주는 모달창
 */
function makeModalBackground() {
  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modalBackground");
  modalBackground.addEventListener("click", (e) => {
    e.target.remove();
    document.querySelectorAll(".block_modal").forEach((menu) => menu.remove());
  });
  document.querySelector("body").appendChild(modalBackground);
}

// 드래그를 끝냈을때
function dragend_handler(event) {
  event.target.classList.remove("dragging"); // 드래그가 끝났으므로 삭제.
}

function dragStart(event) {
  event.target.classList.add("dragging"); // 드래그중인 요소를 알기위해 클래스 지정
  event.dataTransfer.dropEffect = "copy"; //드래그중 마우스 커서 모양을 정하기
}

// 사이드면 state를 side, 위면 top 아래면 bottom 이런식으로.
let dragState = null;

const DRAG_STATE = {
  SIDE: "SIDE",
  TOP: "TOP",
  BOTTOM: "BOTTOM",
};

function dragover_handler(event) {
  event.preventDefault(); //dragover의 기본 동작을 막아야 drop이 정상작동함.
  event.stopPropagation();
  console.log();

  function blockPointerEvent(targetBlock, msg) {
    const block_pointer = document.querySelector(".block_pointer");
    if (block_pointer) {
      block_pointer.remove();
    }
    const newPointer = createPointer();
    targetBlock.insertAdjacentHTML("beforeend", newPointer);
    console.log(msg);
  }

  event.dataTransfer.dropEffect = "move"; //드래그중 마우스 커서 모양을 정하기

  const targetItem = event.currentTarget;
  const targetHeight = targetItem.offsetHeight;
  const { offsetX, offsetY } = event;
  const targetWidth = targetItem.offsetWidth;
  const center = targetHeight / 2;
  const side = targetWidth - 50;

  if (offsetX > side && dragState !== DRAG_STATE.SIDE) {
    dragState = DRAG_STATE.SIDE;
    blockPointerEvent(targetItem, "사이드");
  } else if (
    offsetY > center &&
    offsetX < side &&
    dragState !== DRAG_STATE.BOTTOM
  ) {
    dragState = DRAG_STATE.BOTTOM;
    blockPointerEvent(targetItem, "아래");
  } else if (
    offsetY < center &&
    offsetX < side &&
    dragState !== DRAG_STATE.TOP
  ) {
    dragState = DRAG_STATE.TOP;
    blockPointerEvent(targetItem, "위");
  }
  console.log(targetItem.classList.value);
  console.log(dragState);
}

function drop_handler(event) {
  event.stopPropagation();
  const dragItem = document.querySelector(".dragging").closest(".prodoc_block");
  const targetItem = event.currentTarget;
  const targetHeight = event.target.offsetHeight;

  const { offsetX, offsetY } = event;
  const center = targetHeight / 2;
  let parentId = null;
  let newOrder = null;
  //같은블럭을 드래그하면 이벤트 종료
  if (targetItem.closest(".prodoc_block") == dragItem) {
    return;
  }
  // 블럭 이동을 위한 변수
  const targetBlockOrder = Number(targetItem.dataset.blockOrder);

  // --------------------- if문 시작-------------------------------
  // 만약 토글블럭이면?
  if (event.target.classList.contains("toggle_block")) {
    const toggleTarget = event.target.closest(".prodoc_block");
    const list = toggleTarget.querySelector(".child_item");
    const countTarget = list.querySelectorAll(".prodoc_block");
    let count = countTarget.length;
    newOrder = (count + 1) * 1024;
    dragItem.dataset.blockOrder = newOrder;
    list.appendChild(dragItem);
    parentId = targetItem.dataset.blockId;
  }
  //중앙보다 아래쪽이면
  else if (offsetY > center) {
    //만약 자리 이동이 없다면 return
    if (dragItem == targetItem.nextElementSibling) {
      console.log("위치 결과가 같은 드래그이벤트");
      return;
    }
    const isParent = targetItem.closest(".child_item");

    if (!isParent) {
      parentId = null;
    }

    // (타겟아이템 + 타겟아이템 아래 아이템) / 2 의 order 부여
    if (targetItem.nextElementSibling) {
      const nextTarget = Number(
        targetItem.nextElementSibling.dataset.blockOrder
      );
      newOrder = (targetBlockOrder + nextTarget) / 2;
    } else {
      // 맨 뒤
      newOrder = targetBlockOrder + 1024;
    }
    insertAfter(dragItem, targetItem.closest(".prodoc_block"));
  } else {
    //만약 자리 이동이 없다면 return
    if (dragItem == targetItem.previousElementSibling) {
      console.log("위치 결과가 같은 드래그이벤트");
      return;
    }

    // --------------------- if문 끝-------------------------------

    //(타겟아이템 + 타겟아이템 위의 아이템) / 2 의 order 부여
    if (targetItem.previousElementSibling) {
      const prevTarget = Number(
        targetItem.previousElementSibling.dataset.blockOrder
      );
      newOrder = (targetBlockOrder + prevTarget) / 2;
    } else {
      // 맨 앞
      newOrder = targetBlockOrder / 2;
    }
    //insertBefore - 요소 앞에 삽입
    //타겟의 부모를 넣을것
    container.insertBefore(dragItem, targetItem.closest(".prodoc_block"));
  }

  // 만약 숫자가 이상하면 새로부여
  if (!Number.isInteger(newOrder)) {
    resetOrder();
  } else if (dragItem.dataset.blockOrder === targetItem.dataset.blockOrder) {
    resetOrder();
  }

  if (
    targetItem.dataset.blockType === "OLIST" ||
    dragItem.dataset.blockType === "OLIST"
  ) {
    resetOList();
  }
  dragItem.dataset.blockOrder = newOrder;

  const updateObj = {
    upUser: "pepsiman",
    displayId: dragItem.dataset.blockId,
    rowX: dragItem.dataset.blockOrder,
    parentId,
  };
  updateDBBlock(updateObj);
}
//  drop_handler 끝------------------------------------------------

function resetOrder() {
  const allBlock = document.querySelectorAll(".container > .prodoc_block");
  allBlock.forEach((block, index) => {
    blockOrder = (index + 1) * 1024;
    block.dataset.blockOrder = blockOrder;
    const updateObj = {
      displayId: block.dataset.blockId,
      rowX: blockOrder,
    };
    updateDBBlock(updateObj);
  });
}

//insertAfter - 요소 뒤에 삽입.
function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
