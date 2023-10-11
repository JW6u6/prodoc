// 이벤트를 선언해두는 핸들러 객체
const blockHandler = {
  // 아이디가 다른 블럭 생성 함수 호출
  handleMenuCopyEvent: async (e) => {
    // order 방식을 확인. 저장도 해야함. 분기별로 복제가 좀 다름
    const targetBlock = e.target.closest(".prodoc_block");
    const targetBlockId = targetBlock.dataset.blockId;
    const blockType = targetBlock.dataset.blockType;
    const blockOrder = Number(targetBlock.dataset.blockOrder) + 10;
    const newTemp = makeBlockTemplate();

    const copyObj = {
      displayId: newTemp.displayId,
      type: blockType,
      text: "",
      order: blockOrder,
    };

    // 복제할 블럭의 타입에 따라 해야할것.
    // 체인지 이벤트에서 들고와야할듯?
    if (blockType === "TODO") {
    } else if (blockType === "BOOKMARK") {
      const targetObj = await getBookMark(targetBlockId);
      const { title, description, imgAdrs, url } = targetObj;
      await createBookMark(copyObj.displayId);
      copyObj.text = "";
      await updateDBBookMark({
        displayId: copyObj.displayId,
        title,
        description,
        imgAdrs,
        url,
      });
    } else if (blockType === "OLIST") {
    } else if (blockType === "FILE" || blockType === "IMAGE") {
      await createFileBlock(copyObj.displayId);
      const targetObj = await getBlockFile(targetBlockId);
      const { newName, upName } = targetObj;
      await updateFile({ displayId: copyObj.displayId, upName, newName });
    } else if (blockType === "TOGGLE") {
      // 일단 보류
    } else if (blockType === "VIDEO") {
      const targetObj = await getOneBlock(targetBlockId);
      copyObj.text = targetObj.content;
    } else {
      const content = targetBlock.querySelector(".content").innerText;
      console.log(content);
      copyObj.text = content;
    }

    const copyTemp = updateTemplate(copyObj);
    // 블럭에 맞게 해준뒤 copyblock 업데이트 요청
    updateDBBlock({
      displayId: copyObj.displayId,
      blockId: copyObj.type,
      rowX: copyObj.order,
      content: copyObj.text,
      upUser: blockSessionUserId,
    });

    //실질적 DOM 생성
    targetBlock.insertAdjacentHTML("afterend", copyTemp.template);
    const copyblock = document.querySelector(
      `[data-block-id="${copyTemp.displayId}"]`
    );
    //복제된 블럭에 "블럭이벤트" 생성
    handlingBlockEvent(copyblock);

    closeBlockModal();
  },
  // 블럭 삭제 함수 호출
  handleMenuDeleteEvent: (e) => {
    const blockId = document.querySelector("[data-block-type='modal']").dataset
      .blockId;
    const targetBlock = document.querySelector(
      `.prodoc_block[data-block-id="${blockId}"]`
    );
    deleteBlock(targetBlock);
    closeBlockModal();
  },
  // 댓글 관련 함수 호출
  handleMenuCommentEvent: async (e) => {
    const blockId = document.querySelector("[data-block-type='modal']").dataset
      .blockId;
    const targetBlock = document.querySelector(
      `.prodoc_block[data-block-id="${blockId}"]`
    );
    // 해당 블럭의 댓글리스트를 서버에 요청
    const replyList = await getBlockreplyList(blockId);

    // 댓글창을 만들기
    makeReplyModal(blockId, targetBlock);
    const replyWrapper = document.querySelector(".replyWrapper");
    const replyController = document.querySelector(".modal_reply_controller");
    const replyRegistBtn = replyController.querySelector(".reply_regi_btn");
    // 댓글을 순회하면서 조건에 맞게 뿌리기
    replyList.forEach((reply) => {
      const date = reply.upDate ? reply.upDate : reply.creDate;
      const temp = makeReplyBlock(
        reply.creUser,
        reply.content,
        date,
        reply.replyId
      );
      replyWrapper.insertAdjacentHTML("beforebegin", temp);
    });
    const blockReply = document.querySelector(".reply_modal");
    // 댓글 등록버튼 이벤트
    replyRegistBtn.addEventListener("click", (e) => {
      const replyInput = e.target.previousElementSibling;
      const replyTemp = makeReplyBlock(
        blockSessionUserId,
        replyInput.value,
        "지금"
      );
      replyWrapper.insertAdjacentHTML("beforebegin", replyTemp);
      registReply({
        creUser: blockSessionUserId,
        content: replyInput.value,
        displayId: blockId,
        pageId: workBlockId,
        mentionList: null, // 어케할까
      });
      replyInput.value = "";
      blockReply.scrollTop = blockReply.scrollHeight;
    });
    const blockRemoveBtn = document.querySelectorAll(
      ".reply_block--remove_btn"
    );
    blockRemoveBtn.forEach((removeBtn) => {
      removeBtn.addEventListener("click", (e) => {
        const replyId = e.currentTarget.parentElement.dataset.replyId;
        deleteReply(replyId, blockSessionUserId);
      });
    });
    // closeBlockModal();
  },
  // 블럭 변경 함수 호출
  handleBlockChangeEvent: (e) => {
    const blockId = e.target.closest(`.block_dropdown_menu`).dataset.blockId;
    const menu = makeDropDownMenu(
      blockId,
      { right: -200, width: 100, modalClass: "child_dropdown_menu" },
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
    const blockId = e.target.closest(".block_dropdown_menu").dataset.blockId;
    const menu = makeDropDownMenu(
      blockId,
      { right: -200, width: 100, modalClass: "child_dropdown_menu" },
      [menuTemplateObject.color]
    );
    displayModal(e.target.closest(".block_dropdown_menu"), menu);
    const colorMenu = document.querySelectorAll(".child_dropdown_menu li");
    colorMenu.forEach((menu) => {
      menu.addEventListener("click", blockColorMenuEvent);
    });
  },
  // URL 변경 함수 호출
  handleUrlChangeEvent: (e) => {
    const targetElement = e.target.closest(".prodoc_block");
    const targetContent = targetElement.querySelector(".content");
    const blockId = targetElement.dataset.blockId;

    if (targetContent.classList.contains("block_bookmark")) {
      bookmarkClickEvent(targetElement, targetContent, blockId);
    } else if (targetContent.classList.contains("block_image")) {
      imageRegiClickEvent();
    } else if (targetContent.classList.contains("block_file")) {
      fileRegiClickEvent();
    } else if (targetContent.classList.contains("block_video")) {
      videoClickEvent(targetContent, targetElement, blockId);
    }
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
  //토글일시 전체삭제
  if (block.dataset.blockType === "TOGGLE") {
    deleteToggle(block);
  }
  block.remove();
  deleteDBBlock({ displayId: block.dataset.blockId });
};

/**
 *
 * @param {Element} toggleBlock
 */
function deleteToggle(toggleBlock) {
  const children = toggleBlock.querySelector(".child_item").children;
  if (children.length <= 0) return;
  for (let child of children) {
    const childId = child.dataset.blockId;
    console.log(childId);
    deleteDBBlock({ displayId: childId });
  }
}

// 메뉴와 함께 닫기위한 함수
// 메뉴 하이드 처리때문에 추가
const closeBlockModal = () => {
  document.querySelector(".modalBackground").click();
};
