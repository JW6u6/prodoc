/**
 * 블럭이 가져야할 이벤트를 추가해주는 함수입니다.
 * @param {Element} element 블럭element
 */
function handlingBlockEvent(element) {
  element.addEventListener("dragstart", dragStart);
  element.addEventListener("dragend", dragend_handler);
  element.addEventListener("dragover", dragover_handler);
  element.addEventListener("drop", drop_handler);
  element.addEventListener("keydown", keydown_handler);

  if (element.dataset.blockType !== "DATABASE") {
    element.addEventListener("input", input_handler);
  }
  blockClickEvent(element);
  hljs.highlightAll();
  // 컬럼은 메뉴가 안뜸
  if (element.dataset.blockType === "COLUMN") return;
  blockAttrEvent(element);
  element.addEventListener("mouseenter", mouseenter_handler);
  element.addEventListener("mouseleave", mouseleave_handler);
  element.addEventListener("focusin", (e) => {
    //다른상대는 disabled.
    //그리고 유저의 아이콘 보여주기.
    console.log(e);
    console.log("포커스인");
    const socketEventObj = {
      eventType: "FOCUSIN",
      upUser: blockSessionUserId,
    };
    sendSocketEvent(socketEventObj);
  });
  element.addEventListener("focusout", (e) => {
    //다른상대는 disabled 해제
    console.log(e);
    console.log("포커스아웃");
    const socketEventObj = {
      eventType: "FOCUSOUT",
      upUser: blockSessionUserId,
    };
    sendSocketEvent(socketEventObj);
  });
}
const mouseenter_handler = (e) => {
  const control = e.currentTarget.querySelector(".control");
  control.classList.remove("control_hide");
};

const mouseleave_handler = (e) => {
  // 메뉴가 열려있으면 닫지마세요~
  const menu = e.target.querySelector("[data-block-type='modal']");
  if (menu) return;
  const control = e.currentTarget.querySelector(".control");
  control.classList.add("control_hide");
};

// 특수한 블럭들의 이벤트
const blockClickEvent = (block) => {
  const isDBBlock = block.closest("[data-block-type='DATABASE']");
  if (isDBBlock) {
    getChildList(block.dataset.blockId);
  }
  const isBookMark = block.querySelector(".block_bookmark");
  if (isBookMark) {
    bookMarkEvent(isBookMark);
  }
  const video = block.querySelector(".block_video");
  if (video) {
    videoEvent(video);
  }
  const isToggle = block.querySelector(".block_toggle_btn");
  if (isToggle) {
    toggleBtnEvent(block);
  }
  const isTodo = block.querySelector(".block_todo");
  if (isTodo) {
    todoEvent(isTodo);
  }
  const isFile = block.querySelector(".block_file");
  if (isFile) {
    fileEvent(isFile);
  }
  const isOList = block.querySelector(".o_list");
  if (isOList) {
    oListEvent(isOList);
  }
  const isImage = block.querySelector(".block_image");
  if (isImage) {
    imageEvent(isImage);
  }
};

let count = 1;
/**
 * OList타입 블럭 의 넘버링을 초기화해주는 함수입니다.
 */
const resetOList = () => {
  const lists = document.querySelectorAll(".o_list");
  lists.forEach((item) => {
    oListEvent(item);
  });
};

const oListEvent = (newBlock) => {
  const block = newBlock.closest(".prodoc_block");
  const blockNumber = block.querySelector(".o_list div:first-child");
  const prevBlock = block.previousElementSibling;
  if (prevBlock) {
    if (prevBlock.dataset.blockType === "OLIST") {
      const prevBlockNumber = Number(
        prevBlock.querySelector(".o_list div:first-child").innerText
      );
      count = prevBlockNumber + 1;
      //걔의 순서 +1
    } else {
      count = 1;
    }
  } else {
    count = 1;
  }
  blockNumber.innerHTML = count + ".&nbsp";
};

/**
 *
 * @param {Element} element - image타입의 블럭
 */
const imageEvent = async (element) => {
  const { blockId } = element.closest(".prodoc_block").dataset;
  const existFile = await getBlockFile(blockId); //블럭정보
  if (existFile.newName) {
    const imageBlockTemplate = createImageTemplate(
      `/block/files/${existFile.newName}`
    );
    element.insertAdjacentHTML("afterend", imageBlockTemplate);
    element.remove();
  } else {
    element.addEventListener("click", imageRegiClickEvent);
  }
};

/**
 *   발생시 이미지를 등록하는 이벤트.
 * @param {Event} e - 이벤트리스너의 이벤트.
 */
const imageRegiClickEvent = (e) => {
  const block = e.currentTarget;
  const input = document.querySelector(".block_file-Uploader");
  const blockId = e.currentTarget.closest(".prodoc_block").dataset.blockId;
  input.click();
  input.addEventListener("change", async (e) => {
    const file = input.files;
    console.log(file);
    if (file[0] !== null) {
      let reader = new FileReader();
      reader.onload = function (data) {
        const imageBlockTemplate = createImageTemplate(data.target.result);
        block.insertAdjacentHTML("afterend", imageBlockTemplate);
        block.remove();
      };
      reader.readAsDataURL(file[0]);
      const formData = new FormData();
      formData.append("file", file[0]);

      const upName = file[0].name;
      const newName = await uploadFile(formData);

      updateFile({ displayId: blockId, path: null, newName, upName });
      // 파일을 업데이트해줄것
    }
  });
};

/**
 * 파일블럭이 가져야할 블럭 이벤트
 * @param {Element} element - fileEvent를 걸어줄 fileType의 블럭
 */
const fileEvent = async (element) => {
  const { blockId } = element.closest(".prodoc_block").dataset;
  const existFile = await getBlockFile(blockId); //블럭정보

  console.log(existFile);
  if (existFile.newName) {
    const fileBlockTemp = createFileTemplate({ fileName: existFile.upName });
    element.insertAdjacentHTML("afterend", fileBlockTemp);
    element.remove();
    const fileBlock = document
      .querySelector(`[data-block-id="${blockId}"]`)
      .querySelector(".content");
    fileBlock.addEventListener("click", (e) => {
      const download = document.createElement("a");
      download.download = existFile.newName;
      download.href = `/block/files/${existFile.newName}`;
      download.click();
    });
  } else {
    element.addEventListener("click", fileRegiClickEvent);
  }
};

/**
 * 발생시 파일을 등록하는 이벤트
 * @param {Event} e - 이벤트리스너의 이벤트
 */
const fileRegiClickEvent = (e) => {
  const input = document.querySelector(".block_file-Uploader");
  const { blockId } = e.target.closest(".prodoc_block").dataset;
  input.click();
  input.addEventListener("change", async (e) => {
    const file = input.files;
    if (file[0] !== null) {
      const formData = new FormData();
      formData.append("file", file[0]);
      console.log(file[0]);
      const upName = file[0].name;
      const newName = await uploadFile(formData);
      updateFile({ displayId: blockId, path: null, newName, upName });
    }
  });
};

//TODO 블럭의 이벤트
const todoEvent = async (element) => {
  const { blockId } = element.closest(".prodoc_block").dataset;
  const obj = await getOneBlock(blockId);
  if (obj.checked === "true") {
    element.querySelector("input").checked = true;
    element.querySelector(".content").classList.add("done");
  }

  element.addEventListener("change", (e) => {
    if (e.target.checked) {
      console.log("체크");
      e.target.nextElementSibling.classList.add("done");
    } else {
      console.log("체크해제");
      e.target.nextElementSibling.classList.remove("done");
    }
    updateDBBlock({ displayId: blockId, checked: e.target.checked });
  });
};

// TOGGLE 이벤트
const toggleBtnEvent = async (newBlock) => {
  const id = newBlock.dataset.blockId;
  const toggleBtn = newBlock.querySelector(".block_toggle_btn");
  const childItem = newBlock.querySelector(".child_item");
  const checked = (await getOneBlock(id)).checked;

  console.log("토글블럭", newBlock);
  // 만약 체크가 true면 숨기기 체크가 false면 보이기
  if (checked === "true") {
    childItem.classList.add("hide");
    toggleBtn.classList.remove("open");
    toggleBtn.innerText = "▶";
  } else if (checked === "false") {
    toggleBtn.classList.add("open");
    childItem.classList.remove("hide");
    toggleBtn.innerText = "▼";
  }
  toggleBtn.addEventListener("click", handleSideBtn);
};

// A버튼 이벤트
const blockAttrEvent = (newBlock) => {
  const attrBtn = newBlock.querySelector(".attrBtn");

  //속성 (A) 버튼 이벤트
  attrBtn.addEventListener("click", handleAttrBtn);
};

//사이드 버튼(지금은 토글)
function handleSideBtn(event) {
  const displayId = this.closest(".prodoc_block").dataset.blockId;
  const child = this.closest(".prodoc_block").querySelector(".child_item");
  const sideBtn = event.target;
  console.log(sideBtn);
  child.classList.toggle("hide");
  sideBtn.classList.toggle("open");
  let checked = child.classList.contains("hide") ? true : false;
  console.log(checked);
  updateDBBlock({ displayId, checked });
}

/**
 * 비디오 이벤트
 * @param {Element} element - 비디오 블럭
 */
async function videoEvent(element) {
  const target = element.closest(".prodoc_block");
  const content = target.querySelector(".content");
  const { blockId } = element.closest(".prodoc_block").dataset;
  const block = await getOneBlock(blockId);
  if (block.content) {
    displayVideo(block.content, element.parentElement);
  } else {
    element.addEventListener("click", (e) => {
      videoClickEvent(content, target, blockId);
    });
  }
}

/**
 * 비디오 이벤트
 * @param {Element} block - 비디오 블럭의 wrapper
 * @param {Element} target - 모달위치의 기준이 될 element
 * @param {string} blockId - video블럭의 아이디
 */
const videoClickEvent = (block, target, blockId) => {
  const infoMsg = "영상주소를 입력해주세요";
  makeInputModal(infoMsg, target);
  const modalItem = document.querySelector(".input_modal");
  modalItem.querySelector("input").addEventListener("keydown", (e) => {
    if (e.code == "Enter") {
      const text = e.target.value;
      const pattern = /v=([^&]+)/;
      const match = text.match(pattern);
      if (match) {
        const result = match[1];
        displayVideo(result, block);
        updateDBBlock({ content: result, displayId: blockId });
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    }
  });
  makeModalBackground(modalItem);
};

// 한 함수에 두개의 기능이!?
/**
 *  북마크 이벤트
 * @param {Element} element - 북마크 컨텐츠 블럭
 */
async function bookMarkEvent(element) {
  const block = element.closest(".prodoc_block");
  const { blockId } = block.dataset;
  const book = await getBookMark(blockId);
  if (book.url === null) {
    element.addEventListener("click", (e) => {
      bookmarkClickEvent(block, element, blockId);
    });
  } else {
    const temp = createBookMarkTemplate({
      title: book.title,
      description: book.description,
      imgAdrs: book.imgAdrs,
      url: book.url,
    });
    element.insertAdjacentHTML("afterend", temp);
    element.remove();
  }
}

// 북마크 클릭이벤트 (메뉴 바꾸기때문에.)

/**
 *
 * @param {Element} target - 클릭된 블럭
 * @param {Element} content - 컨텐츠로 바뀔 요소
 * @param {string} blockId - 클릭된 블럭의 아이디
 */
const bookmarkClickEvent = (target, content, blockId) => {
  const infoMsg = "북마크할 주소를 입력해주세요";

  makeInputModal(infoMsg, target);
  const modalItem = document.querySelector(".input_modal");
  modalItem.querySelector("input").addEventListener("keydown", async (e) => {
    if (e.code == "Enter") {
      const url = addHttps(e.target.value);
      let obj = await getBookMarkInfo(url);
      if (obj.error) {
        return;
      }
      if (obj) {
        const temp = createBookMarkTemplate({
          title: obj.title,
          description: obj.desc,
          imgAdrs: obj.img,
          url,
        });
        content.insertAdjacentHTML("afterend", temp);
        content.remove();
        updateDBBookMark({
          displayId: blockId,
          title: obj.title,
          description: obj.desc,
          imgAdrs: obj.img,
          url,
        });
        document.querySelector(".modalBackground").click();
      }
    }
  });
  makeModalBackground(modalItem);
};

/**
 *
 * @param {String} url - 사용자가 입력하는 url
 * @returns {String} https://www.xxxxx.xxx
 */
function addHttps(url) {
  if (url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("www.")) {
    return "https://" + url;
  }
  return "https://www." + url;
}

// A버튼 이벤트
async function handleAttrBtn(e) {
  const id = e.currentTarget.parentNode.dataset.blockId;
  const blockType = e.target.closest(".prodoc_block").dataset.blockType;
  const menuArr = [];
  if (
    blockType === "BOOKMARK" ||
    blockType === "FILE" ||
    blockType === "VIDEO" ||
    blockType === "IMAGE"
  ) {
    menuArr.push(menuTemplateObject.default);
    menuArr.push(menuTemplateObject.urlMenu);
  } else {
    menuArr.push(menuTemplateObject.default);
    menuArr.push(menuTemplateObject.nomalMenu);
  }

  //만약 체인지 가능한 메뉴라면 이거.
  e.target.insertAdjacentHTML(
    "afterend",
    await makeDropDownMenu(id, { left: 50, width: 250 }, menuArr)
  );

  const menu = document.querySelector("[data-menu-type='control']");
  const menuItems = menu.querySelectorAll("li");
  menuItems.forEach((item) => {
    item.addEventListener("click", menuItemClickEvent);
  });

  // 모달 뒷배경 처리
  const modalItme = document.querySelector(".block_dropdown_menu");
  makeModalBackground(modalItme);
  // 모달 뒷배경 처리 끝
}

// 메뉴항목 클릭 이벤트
function menuItemClickEvent(e) {
  const menuType = this.dataset.blockMenu;
  const menuEvent = menuHandler[menuType];
  if (menuEvent) {
    menuEvent(e);
  } else {
    console.log("적절하지않은 이벤트");
  }
}

function blockColorMenuEvent(e) {
  const clickedMenu = e.currentTarget;
  const block = clickedMenu.closest(".prodoc_block");
  const blockId = block.dataset.blockId;
  const content = block.querySelector(".content");
  const menuData = clickedMenu.dataset;
  if (menuData.blockColor) {
    const color = menuData.blockColor;
    console.log(color);
    console.log(block);

    content.style.color = `#${color}`;

    updateDBBlock({ displayId: blockId, color });
  } else if (menuData.blockBackColor) {
    const backColor = menuData.blockBackColor;
    console.log(backColor);
    content.style.backgroundColor = `#${backColor}`;
    updateDBBlock({ displayId: blockId, backColor });
  }
}

// 블록체인지 이벤트.
async function blockChangeMenuEvent(e) {
  const blockId = e.target.closest("div").dataset.blockId;
  let targetBlock = document.querySelector(`[data-block-id="${blockId}"]`);
  const blockType = e.target.dataset.blockType;

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

  // 전환이 불가능한 블럭 처리
  // 블럭업데이트 전에 처리해야할것 (DB에 처리)
  if (blockType === "VIDEO") {
    const blockUpdateObj = {
      displayId: blockId,
      content: "",
    };
    updateDBBlock(blockUpdateObj);
  }
  // 북마크
  if (blockType === "BOOKMARK") {
    await createBookMark(blockId);
  }

  if (blockType === "FILE" || blockType === "IMAGE") {
    await createFileBlock(blockId);
  }

  if (blockType === "DATABASE") {
    console.log(pageBlockId);
    const dbObject = {
      parentId: pageBlockId,
      email: blockSessionUserId,
      pageNum: 999,
      displayId: blockId,
    };
    console.log(dbObject);
    // 데이터베이스 db에 생성
    await createDB2DBblock(dbObject);
    // 데이터 배치
    await getChildList(blockId);
  }
  //DB처리 끝

  handlingBlockEvent(targetBlock);

  // 블럭 업데이트 해줘야함 (타입변경)
  const blockUpdateObj = {
    displayId: blockId,
    upUser: blockSessionUserId,
    blockId: blockType,
  };
  updateDBBlock(blockUpdateObj);
  document.querySelector(".modalBackground").remove();
  const socketEventObj = {
    eventType: "CHANGETYPE",
    displayId: blockId,
    blockType,
    upUser: blockSessionUserId,
  };
  sendSocketEvent(socketEventObj);
}

// 키보드 이벤트
async function keydown_handler(e) {
  e.stopPropagation();
  if (e.target.classList.contains("attr")) {
    attrContentUpdate(e);
    return;
  }
  console.log(e.keyCode);
  const isContentBlock = e.target.classList.contains("content");

  // 엔터이벤트
  if (e.keyCode === 13 && !e.shiftKey && isContentBlock) {
    const enteredBlock = e.currentTarget;
    const nextBlock = enteredBlock.nextElementSibling;
    const enteredBlockOrder = Number(enteredBlock.dataset.blockOrder);
    let order;
    // 다음에 블럭이 있다면 중앙값을 만들어줌 아니면 마지막블럭임.
    if (nextBlock) {
      const nextOrder = Number(nextBlock.dataset.blockOrder);
      order = (enteredBlockOrder + nextOrder) / 2;
    } else {
      order = enteredBlockOrder + 1024;
    }

    e.preventDefault();
    //블럭만들기
    //만약 e.target이 TODO블럭이면 TODO블럭으로 변경!

    if (e.currentTarget.dataset.blockType === "TODO") {
      // 만약 비어있지않다면 TODO블럭을 만들어서 붙이기.
      if (e.target.innerHTML !== "") {
        const template = await updateTemplate({
          displayId: null,
          type: "TODO",
          order,
        });
        const displayObj = {
          template,
          type: null,
          element: e.currentTarget,
        };
        await createBlock2DB({
          displayId: template.displayId,
          pageId: pageBlockId,
          creUser: blockSessionUserId,
          blockId: "TODO",
          rowX: order,
        });
        const newBlock = displayBlock(displayObj);
        focusBlock(newBlock);

        // 블럭생성이벤트 전달
        const socketEventObj = {
          eventType: "CREATEBLOCK",
          template,
          type: null,
          enteredBlock,
          upUser: blockSessionUserId,
        };
        sendSocketEvent(socketEventObj);
      } else {
        // TODO블럭이 비어있다면 해당 블럭을 TEXT로 만들기
        // 똑같은 아이디의 블럭을 만들어서 붙이고 기존의 블럭을 지우는 방식.
        let block = e.currentTarget;
        const blockId = block.dataset.blockId;
        const blockChangeObj = {
          displayId: blockId,
          type: "TEXT",
          text: "",
          order: block.dataset.blockOrder,
        };
        const newBlock = await updateTemplate(blockChangeObj);
        block.insertAdjacentHTML("afterend", newBlock.template);
        block.remove();
        block = document.querySelector(
          `[data-block-id="${newBlock.displayId}"]`
        );
        handlingBlockEvent(block);
        updateDBBlock({
          displayId: blockId,
          upUser: blockSessionUserId,
          blockId: block.dataset.blockType,
        });
        console.log(block.querySelector(".content"));
        block.querySelector(".content").focus();
        //블럭 체인지 이벤트 걸기
      }
    } else if (e.currentTarget.dataset.blockType === "OLIST") {
      if (e.target.innerHTML !== "") {
        const template = await updateTemplate({
          displayId: null,
          type: "OLIST",
          order,
        });
        const displayObj = {
          template,
          type: null,
          element: e.currentTarget,
        };

        await createBlock2DB({
          displayId: template.displayId,
          pageId: pageBlockId,
          creUser: blockSessionUserId,
          blockId: "OLIST",
          rowX: order,
        });
        const newBlock = displayBlock(displayObj);
        focusBlock(newBlock);

        // 블럭생성이벤트 전달
        const socketEventObj = {
          eventType: "CREATEBLOCK",
          template,
          type: null,
          enteredBlock,
          upUser: blockSessionUserId,
        };
        sendSocketEvent(socketEventObj);
      } else {
        // TODO블럭이 비어있다면 해당 블럭을 TEXT로 만들기
        // 똑같은 아이디의 블럭을 만들어서 붙이고 기존의 블럭을 지우는 방식.
        let block = e.currentTarget;
        const blockId = block.dataset.blockId;
        const blockChangeObj = {
          displayId: blockId,
          type: "TEXT",
          text: "",
          order: block.dataset.blockOrder,
        };
        const newBlock = await updateTemplate(blockChangeObj);
        block.insertAdjacentHTML("afterend", newBlock.template);
        block.remove();
        block = document.querySelector(
          `[data-block-id="${newBlock.displayId}"]`
        );
        handlingBlockEvent(block);
        updateDBBlock({
          displayId: blockId,
          upUser: blockSessionUserId,
          blockId: block.dataset.blockType,
        });
        console.log(block.querySelector(".content"));
        block.querySelector(".content").focus();
        //블럭 체인지 이벤트 걸기
      }
    } else {
      // 블럭을 새로 만들기
      const template = makeBlockTemplate(order);
      const isDBpage = e.currentTarget.closest(".dataPage_blocks");

      const displayObj = {
        template,
        type: isDBpage ? "DATA_PAGE" : null,
        element: enteredBlock,
      };
      //블럭 배치 및 이벤트 부여
      const newBlock = displayBlock(displayObj); //문서쪽으로 만듦
      focusBlock(newBlock);

      // 블럭생성이벤트 전달
      const socketEventObj = {
        eventType: "CREATEBLOCK",
        template,
        type: isDBpage ? "DATA_PAGE" : null,
        enteredBlockId: enteredBlock.dataset.blockId,
        upUser: blockSessionUserId,
      };
      sendSocketEvent(socketEventObj);
    }
    // 만약 배치가 끝났는데 order이 비정상적인(ex)float) 형식이면 순서 재할당
    checkAndResetOrder(order);
  }
  // 엔터이벤트의 끝

  if (e.keyCode === 8 && e.target.innerHTML.length == 0 && isContentBlock) {
    // 프리비어스엘리먼트시블링의 editable있는거 골라야함
    if (e.currentTarget.previousElementSibling) {
      const prevElement = e.currentTarget.previousElementSibling;
      console.log(prevElement);
      focusBlock(prevElement);
    }
    const delBlockType = e.currentTarget.dataset.blockType;
    if (delBlockType === "TOGGLE") {
      const children = e.currentTarget.querySelectorAll(".prodoc_block");
      console.log(children);
    }
    e.currentTarget.remove();
    deleteDBBlock({ displayId: e.currentTarget.dataset.blockId });
    const socketEventObj = {
      eventType: "DELETEBLOCK",
      displayId: e.currentTarget.dataset.blockId,
      upUser: blockSessionUserId,
    };
    sendSocketEvent(socketEventObj);
  }
  //위에 키
  if (e.keyCode === 38) {
    e.preventDefault();
    const prevBlock = e.currentTarget.previousElementSibling;
    console.log(e.currentTarget);
    if (prevBlock) {
      focusBlock(prevBlock);
    }
    //아래키
  } else if (e.keyCode === 40) {
    e.preventDefault();
    const nextBlock = e.currentTarget.nextElementSibling;
    if (nextBlock) {
      focusBlock(nextBlock);
    }
  }
}

// 일반 텍스트 저장
function input_handler(event) {
  const displayId = event.target.closest(".prodoc_block").dataset.blockId;
  if (event.target.nodeName == "INPUT") return;
  if (event.target.classList.contains("attr-name")) return;
  const updateObj = {
    eventType: "input",
    upUser: blockSessionUserId,
    displayId,
    content: event.target.innerText,
  };
  saveTran(updateObj);
}

// 블럭 포인터 이벤트
function blockPointerEvent(targetBlock, state, color = "RED") {
  console.log(color);
  const block_pointer = document.querySelector(".block_pointer");
  if (block_pointer) {
    block_pointer.remove();
  }
  let newPointer = null;
  if (state === DRAG_STATE.RSIDE) {
    newPointer = createPointer({ top: 0, bottom: 0, right: 0, color });
  } else if (state === DRAG_STATE.TOP) {
    newPointer = createPointer({ top: 0, left: 0, right: 0, color });
  } else if (state === DRAG_STATE.BOTTOM) {
    newPointer = createPointer({ bottom: 0, left: 0, right: 0, color });
  }
  console.log(state);
  if (newPointer) {
    targetBlock.insertAdjacentHTML("beforeend", newPointer);
  }
}
