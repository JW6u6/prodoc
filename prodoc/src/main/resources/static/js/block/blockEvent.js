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
  element.addEventListener("input", input_handler);
  // element.addEventListener("mouseenter", mouseenter_handler);
  // element.addEventListener("mouseleave", mouseleave_handler);
  blockAttrEvent(element);
  blockClickEvent(element);
  hljs.highlightAll();
}

const mouseenter_handler = (e) => {
  const control = e.currentTarget.querySelector(".control");
  control.classList.remove("control_hide");
};

const mouseleave_handler = (e) => {
  const control = e.currentTarget.querySelector(".control");
  control.classList.add("control_hide");
};

// 특수한 블럭들의 이벤트
const blockClickEvent = (block) => {
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
};

let count = 1;

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

const fileEvent = async (newBlock) => {
  const input = document.querySelector(".block_file-Uploader");
  const { blockId } = newBlock.closest(".prodoc_block").dataset;
  const existFile = await getBlockFile(blockId); //블럭정보

  if (existFile.newName) {
    console.log(existFile);
  } else {
    newBlock.addEventListener("click", (e) => {
      input.click();
      input.addEventListener("change", async (e) => {
        const formData = new FormData();
        const file = input.files;
        formData.append("file", file[0]);

        const upName = file[0].name;
        const newName = await uploadFile(formData);
        console.log(newName);
        updateFile({ displayId: blockId, path: null, newName, upName });
      });
    });
  }
};

//TODO 블럭의 이벤트
const todoEvent = async (newBlock) => {
  const { blockId } = newBlock.closest(".prodoc_block").dataset;
  const obj = await getOneBlock(blockId);
  if (obj.checked === "true") {
    newBlock.querySelector("input").checked = true;
    newBlock.querySelector(".content").classList.add("done");
  }

  newBlock.addEventListener("change", (e) => {
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
const toggleBtnEvent = (newBlock) => {
  const toggleBtn = newBlock.querySelector(".block_toggle_btn");
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
  const child = this.closest(".prodoc_block").querySelector(".child_item");
  child.classList.toggle("hide");
}

/**
 * 비디오 이벤트
 * @param {Element} element - 비디오 블럭
 */
async function videoEvent(element) {
  const { blockId } = element.closest(".prodoc_block").dataset;
  const block = await getOneBlock(blockId);
  if (block.content) {
    displayVideo(block.content, element.parentElement);
  } else {
    element.addEventListener("click", (e) => {
      const block = e.currentTarget;
      const target = e.target.closest(".prodoc_block");
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
    });
  }
}

/**
 *  북마크 이벤트
 * @param {Element} element - 북마크 블럭
 */
async function bookMarkEvent(element) {
  const { blockId } = element.closest(".prodoc_block").dataset;
  const book = await getBookMark(blockId);
  console.log(book.url);
  if (book.url === null) {
    element.addEventListener("click", (e) => {
      const infoMsg = "북마크할 주소를 입력해주세요";
      const target = e.target.closest(".prodoc_block");

      makeInputModal(infoMsg, target);
      const modalItem = document.querySelector(".input_modal");
      modalItem
        .querySelector("input")
        .addEventListener("keydown", async (e) => {
          if (e.code == "Enter") {
            const url = addHttps(e.target.value);
            let obj = await getBookMarkInfo(url);
            if (obj) {
              const temp = createBookMarkTemplate({
                title: obj.title,
                description: obj.desc,
                imgAdrs: obj.img,
                url,
              });
              element.insertAdjacentHTML("afterend", temp);
              element.remove();
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
function handleAttrBtn(e) {
  const id = e.currentTarget.parentNode.dataset.blockId;
  const blockType = e.target.closest(".prodoc_block").dataset.blockType;
  const menuArr = [];
  if (
    blockType === "BOOKMARK" ||
    blockType === "FILE" ||
    blockType === "VIDEO"
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
    makeDropDownMenu(id, { left: -100 }, menuArr)
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

// 블록체인지 이벤트입니다.
async function blockChangeMenuEvent(e) {
  const blockId = e.target.closest("div").dataset.blockId;
  let targetBlock = document.querySelector(`[data-block-id="${blockId}"]`);
  const blockType = e.target.dataset.blockType;

  // 바꾸려는 블럭의 값
  let text = "";
  const content = targetBlock.querySelector(".content");
  if (content) {
    text = content.innerHTML;
  }

  // 해당 블럭의 순서
  const order = targetBlock.dataset.blockOrder;

  const blockChangeObj = {
    displayId: blockId,
    type: blockType,
    text: blockType === "VIDEO" ? "" : text,
    order,
  };
  const block = updateTemplate(blockChangeObj);

  targetBlock.insertAdjacentHTML("afterend", block.template);
  targetBlock.remove();
  targetBlock = document.querySelector(`[data-block-id="${blockId}"]`);

  // 전환이 불가능한 블럭 처리
  // 블럭이 생성되기전 처리해야할것
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

  if (blockType === "FILE") {
    await createFileBlock(blockId);
  }

  handlingBlockEvent(targetBlock);

  // 블럭 업데이트 해줘야함 (타입변경)
  const blockUpdateObj = {
    displayId: blockId,
    upUser: "pepsiman",
    blockId: blockType,
  };
  updateDBBlock(blockUpdateObj);
  document.querySelector(".modalBackground").remove();
}

// 키보드 이벤트
function keydown_handler(e) {
  e.stopPropagation();
  const isContentBlock = e.target.classList.contains("content");
  if (e.keyCode === 13 && !e.shiftKey && isContentBlock) {
    e.preventDefault();
    //블럭만들기
    const temp = makeBlockTemplate();
    //블럭 배치 및 이벤트 부여
    displayBlock(temp); //문서쪽으로 만듦
  }
  if (e.keyCode === 8 && e.target.innerHTML.length == 0 && isContentBlock) {
    // 프리비어스엘리먼트시블링의 editable있는거 골라야함
    if (e.currentTarget.previousElementSibling.querySelector(".content")) {
      e.currentTarget.previousElementSibling.querySelector(".content").focus();
      // if(e.currentTarget.previousSibling)
    }
    e.currentTarget.remove();
    deleteDBBlock({ displayId: e.currentTarget.dataset.blockId });
  }
}

// 일반 텍스트 저장
function input_handler(event) {
  const displayId = event.target.closest(".prodoc_block").dataset.blockId;
  if (event.target.nodeName == "INPUT") return;

  const updateObj = {
    eventType: "input",
    upUser: "pepsiman",
    displayId,
    content: event.target.innerText,
  };
  saveTran(updateObj);
}
