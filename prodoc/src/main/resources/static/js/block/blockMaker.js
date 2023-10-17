/**
 * 블럭을 dom에 등록하는 함수
 * @param {Object} displayObj - display에 필요한 Object.
 * @param {Object} displayObj.template   - template 객체.
 * @param {string} displayObj.type       - DATA_PAGE or PAGE
 * @param {Element} displayObj.element   - 위치를 참조할 element
 * @returns {Element}
 */
function displayBlock({ template, type, element }) {
  if (type === "DATA_PAGE") {
    // const dbModalPage = document.querySelector(".dataPage_blocks");
    if (element) {
      element.insertAdjacentHTML("afterend", template.template);
    } else {
      const dbPageContainer = document.querySelector(".dataPage_blocks");
      dbPageContainer.insertAdjacentHTML("beforeend", template.template);
    }
  } else {
    if (element) {
      element.insertAdjacentHTML("afterend", template.template);
    } else {
      container.insertAdjacentHTML("beforeend", template.template);
    }
  }

  const newblock = document.querySelector(
    `[data-block-id="${template.displayId}"]`
  );
  handlingBlockEvent(newblock);

  return newblock;
}

// 블럭 포커스
function focusBlock(block) {
  const blockContent = block.querySelector(".content");
  if (blockContent) {
    placeCaretAtEnd(blockContent);
  }
}

//주워온 커서 맨끝 이동시키기
function placeCaretAtEnd(element) {
  element.focus();
  if (
    typeof window.getSelection != "undefined" &&
    typeof document.createRange != "undefined"
  ) {
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
    const textRange = document.body.createTextRange();
    textRange.moveToElementText(element);
    textRange.collapse(false);
    textRange.select();
  }
}

/**
 * 소켓을 사용해 dom에 등록하는 함수
 * @param {Object} displayObj - display에 필요한 Object.
 * @param {Object} displayObj.template   - template 객체.
 * @param {string} displayObj.type       - DATA_PAGE or PAGE
 * @param {Element} displayObj.element   - 위치를 참조할 element
 * @param {isSocket} displayObj.isSocket - 소켓에서 호출하는지의 여부
 */
function socketDisplayBlock({ template, type, element }) {
  displayBlock({ template, type, element });
  const enteredBlockId = element ? element.dataset.blockId : null;
  const socketEventObj = {
    eventType: "CREATEBLOCK",
    template,
    type,
    enteredBlockId,
    upUser: blockSessionUserId,
  };
  sendSocketEvent(socketEventObj);
}

/**
 *
 * @param {{template:string,displayId:string}} template - 생성된 템플릿 오브젝트
 * @param {Element} parent - 부모Element
 */
const displayChildBlock = (template, parent) => {
  parent
    .querySelector(".child_item")
    .insertAdjacentHTML("beforeend", template.template);

  const newblock = document.querySelector(
    `[data-block-id="${template.displayId}"]`
  );

  handlingBlockEvent(newblock);
};

// 기본적인 블럭을 만드는 함수.
function makeBlockTemplate(order) {
  // 블럭을 새로 생성하면
  const displayId = uuidv4();
  const rowX = order ? order : blockCount * 1024;
  blockCount += 1;
  //블럭저장
  const blockObj = {
    displayId,
    rowX,
    pageId: pageBlockId,
    blockId: "TEXT",
    creUser: blockSessionUserId,
    content: "",
  };
  createBlock2DB(blockObj);

  const block = templateMaker();

  const template = `
        <div class="prodoc_block" data-block-type="TEXT"  data-block-id="${displayId}" data-block-order="${rowX}">
            <div class="control control_hide" data-block-id="${displayId}" draggable="true">
            <button class="attrBtn">A</button>
            <button>H</button>
            </div>
            ${block}
        </div>
        `;
  return { template, displayId };
}

/**
 * 블럭을 만드는 함수입니다. HTML형식 String을 반환합니다.
 * @param {{displayId:string,type:string,text:string,order:number}} blockObj - 블럭의 형태를 바꿉니다. displyId, type, text, order이 필요합니다.
 * @returns {Promise<{template:string,displayId:string}>}
 */
async function updateTemplate({
  displayId,
  type,
  text = "",
  order,
  color,
  backColor,
}) {
  let block = null;
  if (type === "DATABASE") {
    block = createDBblock({ displayId, content: "새 데이터베이스" });
  } else {
    block = templateMaker(
      type,
      text,
      color ? color : "",
      backColor ? backColor : ""
    );
  }

  if (!displayId) {
    displayId = uuidv4();
    const blockSaveObj = {
      displayId,
      blockId: type,
      rowX: order,
      pageId: pageBlockId,
    };
    if (type === "DATABASE") {
      await createBlock2DB(blockSaveObj);
    }
  }
  let controlPanel = `
  <div class="control control_hide" data-block-id="${displayId}" draggable="true">
  <button class="attrBtn">A</button>
  <button>H</button>
  </div>`;
  if (type === "COLUMN") {
    controlPanel = "";
  }
  const template = `
        <div class="prodoc_block" data-block-type="${type}" data-block-id="${displayId}" data-block-order="${order}">
            ${controlPanel}
            ${block}
        </div>
        `;
  return { template, displayId };
}

/**
 *
 * @param {String} type - 블럭의 타입(H1,H2,H3,LINE)
 *                        null값에 대응하는것은 TEXT.
 * @param {String} text - 블럭이 원래 가지고 있는 텍스트값
 * @returns {String}
 */
function templateMaker(
  type = "TEXT",
  text = "",
  color = "black",
  backColor = "white"
) {
  // 기본적인 텍스트 블록(생성시 기본값)
  const textblock = ` 
  <div class="block_wrapper">
    <div class="content" style="color:#${color};background-color:#${backColor}"  contenteditable="true">${text}</div>
  </div>`;

  // h1
  const h1 = `
  <div class="block_wrapper">
    <h2 class="content" style="color:#${color};background-color:#${backColor}"  contenteditable="true">${text}</h2>
  <div>
  `;

  // h2
  const h2 = `
  <div class="block_wrapper">
    <h3 class="content" style="color:#${color};background-color:#${backColor}"  contenteditable="true">${text}</h3>
  </div>
  `;

  // h3
  const h3 = `
  <div class="block_wrapper">
    <h4 class="content" style="color:#${color};background-color:#${backColor}"  contenteditable="true">${text}</h4>
  </div>`;

  // hr
  const hr = `
  <div class="block_wrapper" style="display:flex;justify-content:center;align-items:center;padding:4px;">
    <div class="separator" style="border-bottom:1px solid black;height:1px; width:100%;"></div>
    </div>
  `;

  // 페이지 블록
  const block_page = `
  <div class="block_wrapper"><a class="content" href="#">${text}</a></div>
  `;

  //TODO 블록
  const block_todo = `
  <div style="width:100%" class="block_wrapper">
    <div style="display:flex;" class="block_todo">
      <input type="checkbox" >
      <div style="width:100%" class="content" style="color:#${color};background-color:#${backColor}" contenteditable="true">${text}</div>
    </div>
  </div>`;

  // 파일 블록
  const block_file = `
    <div class="block_wrapper">
    <div class="content block_file">파일을 업로드하려면 클릭하세요.</div>
    </div>
  `;

  // 순서없는 리스트
  const block_uList = `
  <div style="width:100%" class="block_wrapper">
    <div style="display:flex;" class="u_list">
      <div>●</div>
      <div style="width:100%" class="content" style="color:#${color};background-color:#${backColor}" contenteditable="true">${text}</div>
    </div>
  </div> 
  `;

  //순서 있는 리스트
  const block_oList = `
    <div style="width:100%" class="block_wrapper">
      <div style="display:flex;" class="o_list">
        <div></div>
        <div style="width:100%" class="content" style="color:#${color};background-color:#${backColor}" contenteditable="true">${text}</div>
      </div>
    </div>
  `;

  // 토글블럭
  const block_toggle = `
    <div class="block_wrapper">
      <div class="toggle_block content" style="color:#${color};background-color:#${backColor}" contenteditable="true">${text}</div>
      <div class="child_item"></div>
    </div>
    <div><button class="block_toggle_btn"></button></div>
  `;

  // 페이지 링크 블럭
  const block_pLink = `
  <div class="block_wrapper">
    <div class="content">
      pageLink
    </div>
  </div>
  `;

  // 이미지 블럭
  const block_img = `
  <div class="block_wrapper">
    <div class="content block_image">
      이미지를 추가하려면 클릭해주세요.
    </div>
  </div>`;

  // 주소를 입력하면 iframe을 동적으로 불러오기.
  /*
    1. 비디오 블럭인걸 알려주기
    2. 클릭하면 url 모달창 열기
    3. url 모달창에서 url을 입력
    4. url을 기반으로 iframe 생성
    5. 짜잔. 이 블럭은 교체불가능.
  */
  const block_video = `
  <div class="block_wrapper">
    <div class="content block_video">
      <div>비디오를 추가하려면 클릭하세요</div>
    </div>
  </div>`;

  // 북마크 블럭
  const block_bookMark = `
  <div class="block_wrapper">
    <div class="content block_bookmark">
      북마크를 추가하려면 클릭하세요
    </div>
  </div>`;

  // 디비블럭
  const block_db = `
  <div class="block_wrapper">
    <div class="content">
      db
    </div>
  </div>`;

  // 동기화 블럭
  const block_sync = `
  <div class="block_wrapper">
  <div class="content" contenteditable="true">
    db
  </div>
</div>`;

  // 2개의 열이 있는 블럭 (사이드 드래그)
  const block_column = `
    <div class="block_wrapper">
      <div class="content block_column child_item">
      </div>
    </div>
  `;

  let block = null;

  const blockType = {
    TEXT: textblock,
    H1: h1,
    H2: h2,
    H3: h3,
    LINE: hr,
    PAGE: block_page,
    TODO: block_todo,
    FILE: block_file,
    ULIST: block_uList,
    OLIST: block_oList,
    TOGGLE: block_toggle,
    PLINK: block_pLink,
    IMAGE: block_img,
    VIDEO: block_video,
    BOOKMARK: block_bookMark,
    DATABASE: block_db,
    SYNC: block_sync,
    COLUMN: block_column,
  };

  // 템플릿 블럭
  block = blockType[type];
  return block;
}

// 하위 메뉴 사용가능하게.
/**
 *
 * @param {string} id - 블럭의 아이디.
 * @param {Array} menuTemp - 메뉴의 추가 템플릿.
 * @returns
 */
async function makeDropDownMenu(id, option = {}, menuTemp) {
  const { top = 0, left = 0, width = 100, modalClass = "" } = option;
  let extendsMenu = "";
  menuTemp.forEach((temp) => {
    extendsMenu += temp;
  });

  const blockInfo = await getOneBlock(id);
  const { creUser, upUser, creDate, upDate } = blockInfo;

  const blockInfoObj = {
    creUser,
    upUser,
    upDate,
    creDate,
  };

  const blockInfoTemplate = makeBlockInfoTemplate(blockInfoObj);
  const template = `
  <div role="dialog" data-block-id="${id}" data-block-type="modal" class="block_modal block_dropdown_menu ${modalClass}" style="position:absolute;top:${top}px;left:${left}px;width:${width}px">
    <ul class="block_dropdown_menu_list" data-menu-type="control">
    ${extendsMenu}
    </ul>
    ${modalClass === "child_dropdown_menu" ? "" : blockInfoTemplate}
  </div>
`;
  return template;
}

/**
 *
 * @param {Object} blockInfoObj
 * @param {string} blockInfoObj.creUser
 * @param {string} blockInfoObj.upUser
 * @param {string} blockInfoObj.upDate
 * @param {string} blockInfoObj.creDate
 * @returns {string} blockInfoTemplate
 */
function makeBlockInfoTemplate({ creUser, upUser, upDate, creDate }) {
  const template = `
    <div>
      <div>${upUser ? upUser : creUser}</div>
      <div>${upDate ? upDate : creDate}</div>
    </div>
  `;
  return template;
}

const menuTemplateObject = {
  default: `<li data-block-menu="copy">복제</li>
            <li data-block-menu="delete">삭제</li>
            <li data-block-menu="comment">댓글</li>`,
  nomalMenu: `
              <li data-block-menu="blockChange">전환</li>
              <li data-block-menu="color">색</li>
            `,
  urlMenu: `<li data-block-menu="urlChange">바꾸기</li>`,
  changeMenu: `
    <li data-block-type="TEXT">텍스트</li>
    <li data-block-type="H1">h1</li>
    <li data-block-type="H2">h2</li>
    <li data-block-type="H3">h3</li>
    <li data-block-type="LINE">line</li>
    <hr>
    <li data-block-type="PAGE">페이지</li>
    <li data-block-type="TODO">할 일</li>
    <li data-block-type="LINK">링크</li>
    <li data-block-type="IMAGE">이미지</li>
    <li data-block-type="FILE">파일</li>
    <li data-block-type="TOGGLE">토글</li>
    <li data-block-type="BOOKMARK">북마크</li>
    <li data-block-type="OLIST">순서있는리스트</li>
    <li data-block-type="ULIST">순서없는리스트</li>
    <li data-block-type="VIDEO">비디오</li>
    <li data-block-type="DATABASE">데이터베이스</li>
`,
  color: `
      <li data-block-color="faa0a0">빨간색</li>
      <li data-block-color="99b5e9">파란색</li>
      <li data-block-color="1db37b">초록색</li>
      <li data-block-color="f9f871">노랑색</li>
      <li data-block-color="a200ff">보라색</li>
      <li data-block-color="ffffff">하얀색</li>
      <li data-block-color="000000">검은색</li>
      <hr>
      <li data-block-back-color="faa0a0">빨간색</li>
      <li data-block-back-color="99b5e9">파란색</li>
      <li data-block-back-color="1db37b">초록색</li>
      <li data-block-back-color="f9f871">노란색</li>
      <li data-block-back-color="a200ff">보라색</li>
      <li data-block-back-color="ffffff">하얀색</li>
      <li data-block-back-color="000000">검은색</li>
  `,
};

function createMessage(text) {
  return `<div>${text}</div>`;
}

function createInput() {
  return `<div><input type="text"/></div>`;
}

function makeInputModal(text) {
  const template = `<div>${text}</div><div></div>`;
  return template;
}
/**
 *
 * @param {Element} target - 클릭된 블럭
 * @param {String} template - 템플릿
 */
function displayModal(target, template) {
  target.insertAdjacentHTML("afterend", template);
}

/**
 *
 * @param {String} text - 모달에 띄울 메세지
 * @param {Element} target - 모달위치의 기준이 되는 요소
 */
function makeInputModal(text, target) {
  const msg = createMessage(text);
  const input = createInput();
  const content = `${msg}${input}`;
  const template = `<div class="block_modal input_modal modal_item" style="position:absolute">${content}</div>`;
  displayModal(target, template);
}
function makeVideo(vId) {
  const template = `<iframe 
   src="https://www.youtube.com/embed/${vId}"
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; 
    autoplay;  clipboard-write; encrypted-media;
     gyroscope; picture-in-picture; web-share" 
     allowfullscreen></iframe>`;

  return template;
}

/**
 *
 * @param {string} displayId - 해당 블럭의 아이디.
 * @param {Element} target - 모달을 달아줄 김치
 */
function makeReplyModal(displayId, target, { left = "" }) {
  const template = `
    <div data-block-id="${displayId}" 
    style="left:${left}px;"
    class="reply_modal block_modal input_modal modal_item">
      <div class="replyWrapper"></div>
      <div class="modal_reply_controller"><input placeholder="댓글을 입력하세요" type="txet"/><button class="reply_regi_btn">등록</button></div>
    </div>
  `;
  displayModal(target, template);
}

/**
 *
 * @param {string} user - 댓글을 단 사람
 * @param {string} text - 댓글 내용
 * @param {string} date - 댓글을 단 시간 or 업데이트된 시간
 * @param
 * @returns {string} 댓글블럭템플릿
 */
function makeReplyBlock(user, text, date, id, src) {
  const replyTemp = `
    <div class="block_reply">
      <div class="reply_block--header" data-reply-id="${id}">
        <div><img src="/files/${src}" onerror="this.src='images/noneUser.jpg'"></img></div>
        <div>${user}</div>
        <div>${date}</div>
        ${
          user === blockSessionUserId
            ? '<div class="reply_block--remove_btn">X</div>'
            : ""
        }
      </div>
      <div class="reply_block--content">${text}</div>
    </div>
  `;
  return replyTemp;
}

/**
 * 비디오를 그려주는 함수입니다.
 * @param {string} result - 유튜브의 비디오 아이디
 * @param {Element} target - 해당 블럭의 blockWrapper
 */
function displayVideo(result, target) {
  const modal = document.querySelector(".modalBackground");
  const videoBlock = makeVideo(result);
  target.innerHTML = "";
  target.insertAdjacentHTML("afterbegin", videoBlock);
  if (modal) modal.click();
}

/**
 *  북마크 템플릿
 * @param {{title:string,description:string,imgAdrs:string,url:string}}
 * @returns
 */
function createBookMarkTemplate({ title, description, imgAdrs, url }) {
  const bookTemp = `
  <div class="content block_bookmark">
    <div><img class="bookmark_img" src="${imgAdrs}"/></div>
    <div>
      <div>${title}</div>
      <div>${description}</div>
      <div><a href="${url}">${url}</a></div>
    </div>
  </div>
`;

  return bookTemp;
}

function createFileTemplate({ fileName }) {
  const fileTemp = `
    <div class="content block_file">
      <div>❤</div>
      <div>${fileName}</div>
    <div>
  `;
  return fileTemp;
}

function createImageTemplate(imgSrc) {
  const imageTemp = `
    <div class="content block_image">
      <img class="block_img" src="${imgSrc}" />
    </div>
  `;
  return imageTemp;
}

function createPointer({
  top = "",
  bottom = "",
  left = "",
  right = "",
  color = "",
}) {
  const pointerTemp = `
    <div class="block_pointer" style="top:${top};bottom:${bottom};left:${left};right:${right};border-color:${color}"></div>
  `;
  return pointerTemp;
}

// 블럭만들기
/**
 * 모달 뒷배경을 만들어주는 함수.
 * 클릭시 modal과 함께 제거됨
 * @param {Element} modal - 화면에 보여주는 모달창
 */
function makeModalBackground() {
  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modalBackground");
  modalBackground.addEventListener("click", (e) => {
    const modal = document.querySelector("[data-block-type='modal']");
    if (modal) {
      const control = modal.closest(".control");
      if (control) {
        control.classList.toggle("control_hide");
      }
    }
    e.target.remove();
    document.querySelectorAll(".block_modal").forEach((menu) => menu.remove());
  });
  document.querySelector("body").appendChild(modalBackground);
}
