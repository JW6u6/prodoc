/**
 * 블럭만들기 함수입니다.
 * @param {Object} template - 생성된 템플릿 오브젝트.
 *
 */
function displayBlock(template) {
  //부모가 있으면 부모의 아이템으로 아니면 문서쪽으로.
  container.insertAdjacentHTML("beforeend", template.template);
  const newblock = document.querySelector(
    `[data-block-id="${template.displayId}"]`
  );
  handlingBlockEvent(newblock);

  if (newblock.querySelector(".content")) {
    newblock.querySelector(".content").focus();
  }
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

function makeBlockTemplate() {
  // 블럭을 새로 생성하면
  const displayId = self.crypto.randomUUID();
  const rowX = blockCount * 1024;
  blockCount += 1;
  //블럭저장
  const blockObj = {
    displayId,
    rowX,
    pageId,
    blockId: "TEXT",
    creUser: "pepsiman",
    content: "",
  };
  createDBBlock(blockObj);

  const block = templateMaker();

  const template = `
        <div class="prodoc_block" data-block-id="${displayId}" data-block-order="${rowX}">
            <div class="control" style="position:relative" data-block-id="${displayId}" draggable="true">
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
 * @param {object} blockObj - 블럭의 형태를 바꿉니다. displyId, type, text, order이 필요합니다.
 * @returns {Object}
 */
function updateTemplate({ displayId, type, text = "", order }) {
  const block = templateMaker(type, text);
  const template = `
        <div class="prodoc_block" data-block-type="${type}" data-block-id="${displayId}" data-block-order="${order}">
            <div class="control" data-block-id="${displayId}" draggable="true">
            <button class="attrBtn">A</button>
            <button>H</button>
            </div>
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
function templateMaker(type = "TEXT", text = "") {
  // 기본적인 텍스트 블록(생성시 기본값)
  const textblock = ` 
  <div class="block_wrapper">
    <div class="content" contenteditable="true">${text}</div>
  </div>`;

  // h1
  const h1 = `
  <div class="block_wrapper">
    <h2 class="content" contenteditable="true">${text}</h2>
  <div>
  `;

  // h2
  const h2 = `
  <div class="block_wrapper">
    <h3 class="content" contenteditable="true">${text}</h3>
  </div>
  `;

  // h3
  const h3 = `
  <div class="block_wrapper">
    <h4 class="content" contenteditable="true">${text}</h4>
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
      <div style="width:100%" class="content" contenteditable="true">${text}</div>
    </div>
  </div>`;

  // 파일 블록
  const block_file = `
    <div class="block_wrapper">
    <div class="content block_file">파일을 업로드하려면 클릭하세요 제발 진자운동</div>
    </div>
  `;

  // 순서없는 리스트
  const block_uList = `
  <div style="width:100%" class="block_wrapper">
    <div style="display:flex;" class="u_list">
      <div>●</div>
      <div style="width:100%" class="content" contenteditable="true">${text}</div>
    </div>
  </div> 
  `;

  //순서 있는 리스트
  const block_oList = `
    <div style="width:100%" class="block_wrapper">
      <div style="display:flex;" class="o_list">
        <div></div>
        <div style="width:100%" class="content" contenteditable="true">${text}</div>
      </div>
    </div>
  `;

  // 표
  const block_brd = `
    <div class="block_wrapper">
      <div class="content">TABLE<div>
    </div>
  `;

  // 토글블럭
  const block_toggle = `
    <div class="block_wrapper">
      <div class="toggle_block content" contenteditable="true">${text}</div>
      <div class="child_item"></div>
    </div>
    <div><button class="block_toggle_btn">></button></div>
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
    <div class="content">
      img
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
      <div>Click ME</div>
    </div>
  </div>`;

  //코드블럭.... 맨 마지막
  const block_codeBlock = `
  <div class="block_wrapper">
    <div class="content">
      <pre class="js"><code contenteditable="true" class=" code_block"></code></pre>
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
    TABLE: block_brd,
    TOGGLE: block_toggle,
    PLINK: block_pLink,
    IMAGE: block_img,
    VIDEO: block_video,
    CODE: block_codeBlock,
    BOOKMARK: block_bookMark,
    DATABASE: block_db,
    SYNC: block_sync,
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
function makeDropDownMenu(id, option = {}, menuTemp) {
  const { top = 0, left = 0, width = 100, cls = "" } = option;
  let extendsMenu = "";
  menuTemp.forEach((temp) => {
    extendsMenu += temp;
  });
  const template = `
  <div role="dialog" data-block-id="${id}" data-block-type="modal" class="block_modal block_dropdown_menu ${cls}" style="position:absolute;top:${top}px;left:${left}px;width:${width}px">
    <ul class="block_dropdown_menu_list" data-menu-type="control">
    ${extendsMenu}
    </ul>
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
  <ul class="block_dropdown_menu_list">
    <li data-block-type="TEXT">텍스트</li>
    <li data-block-type="H1">h1</li>
    <li data-block-type="H2">h2</li>
    <li data-block-type="H3">h3</li>
    <li data-block-type="LINE">line</li>
    <hr>
    <li data-block-type="PAGE">페이지</li>
    <li data-block-type="TODO">할 일</li>
    <li data-block-type="SYNC">동기화</li>
    <li data-block-type="LINK">링크</li>
    <li data-block-type="IMAGE">이미지</li>
    <li data-block-type="CODE">코드블럭</li>
    <li data-block-type="FILE">파일</li>
    <li data-block-type="INDEX">목차</li>
    <li data-block-type="BUTTON">버튼</li>
    <li data-block-type="TOGGLE">토글</li>
    <li data-block-type="CHECK">체크</li>
    <li data-block-type="BOOKMARK">북마크</li>
    <li data-block-type="OLIST">순서있는리스트</li>
    <li data-block-type="ULIST">순서없는리스트</li>
    <li data-block-type="TABLE">표</li>
    <li data-block-type="VIDEO">비디오</li>
  </ul>
`,
};

function createMessage(text) {
  return `<div>${text}</div>`;
}

function createInput() {
  return `<div><input type="text"/></div>`;
}

function makeInputModal(text) {
  const template = `<div>${text}</div><div></div></div>`;
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

function createPointer() {
  const pointerTemp = `
    <div class="block_pointer"></div>
  `;
  return pointerTemp;
}
