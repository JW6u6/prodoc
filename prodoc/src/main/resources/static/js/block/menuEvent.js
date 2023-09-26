// 이벤트를 선언해두는 핸들러 객체
const blockHandler = {
  // 아이디가 다른 블럭 생성 함수 호출
  handleMenuCopyEvent: (e) => {
    console.log(e);
    console.log("복사됨");
  },
  // 블럭 삭제 함수 호출
  handleMenuDeleteEvent: (e) => {
    const blockId = document.querySelector("[data-block-type='modal']").dataset
      .blockId;
    const targetBlock = document.querySelector(
      `.prodoc_block[data-block-id="${blockId}"]`
    );
    deleteBlock(targetBlock);
  },
  // 댓글 관련 함수 호출
  handleMenuCommentEvent: (e) => {
    console.log("댓글됨");
  },
  // 블럭 변경 함수 호출
  handleBlockChangeEvent: (e) => {
    const blcokId = e.target.closest(`.block_dropdown_menu`).dataset.blockId;
    const menu = makeDropDownMenu(
      blcokId,
      { left: -200, width: 100, cls: "child_dropdown_menu" },
      [menuTemplateObject.changeMenu]
    );
    displayModal(e.target.closest(".block_dropdown_menu"), menu);
    const changeMenu = document.querySelectorAll(".child_dropdown_menu li");
    changeMenu.forEach((menu) => {
      menu.addEventListener("click", blockChangeMenuEvent);
    });
  },
  // 색 변경 함수 호출
  handleColorChangeEvent: (e) => {
    console.log("색 변경");
  },
  // URL 변경 함수 호출
  handleUrlChangeEvent: (e) => {
    console.log("URL 변경");
  },
};

// 많은 if else 를 대체할 object
const menuHandler = {
  copy: blockHandler.handleMenuCopyEvent,
  delete: blockHandler.handleMenuDeleteEvent,
  comment: blockHandler.handleMenuCommentEvent,
  blockChange: blockHandler.handleBlockChangeEvent,
  color: blockHandler.handleColorChangeEvent,
  urlChange: blockHandler.handleUrlChangeEvent,
};

const deleteBlock = (block) => {
  block.remove();
  deleteDBBlock({ displayId: block.dataset.blockId });
};
