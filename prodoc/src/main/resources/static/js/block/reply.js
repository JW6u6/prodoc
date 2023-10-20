/**
 *
 * @param {Element} element - 댓글이 클릭된 요소
 */
function makeReplyBtn(element) {
  element.addEventListener("click", showReply);
}
//클릭시 댓글을 보여주는 핸들러
function showReply(e) {
  // 댓글목록창이 이미 있는지 체크
  let replyTarget = document.querySelector(".page_reply");
  // 이미 있다면 지우기
  if (replyTarget) {
    replyTarget.remove();
  } else {
    // 아니면 동적으로 생성
    const replyBox = document.createElement("div");
    replyBox.classList.add("page_reply");
    const closeBtnWrapper = document.createElement("div");
    closeBtnWrapper.classList.add("page_reply_btn_wrapper");
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "X";
    closeBtn.classList.add("closeBtn");
    closeBtn.addEventListener("click", showReply);
    closeBtnWrapper.appendChild(closeBtn);
    replyBox.appendChild(closeBtnWrapper);
    container.insertAdjacentElement("afterend", replyBox);
    replyTarget = document.querySelector(".page_reply");
    makeReplyList(replyTarget);
  }
}
//페이지 댓글 리스트 만드는 함수
async function makeReplyList(appendTarget) {
  const replylist = await getPageReplyList(pageBlockId);
  replylist.forEach((reply) => {
    console.log(reply);
    const date = reply.upDate ? reply.upDate : reply.creDate;
    const temp = makeReplyBlock(
      reply.nickname,
      reply.creUser,
      reply.content,
      date,
      reply.replyId,
      reply.profile
    );
    appendTarget.insertAdjacentHTML("beforeend", temp);
    const replyBlockImg = document.querySelector(
      `[data-reply-id="${reply.replyId}"] img`
    );
    const replyBlock = document.querySelector(`[data-reply-id="${reply.replyId}"]`).querySelector(".reply_block--remove_btn");
      console.log(replyBlock) ;
      replyBlock.addEventListener("click",async (e)=>{
        const replyBlock = e.currentTarget.closest(".block_reply");
        const result = await deleteReply(reply.replyId, blockSessionUserId);

        if (result.result === "success") {
          replyBlock.remove();
        }
      })
    replyBlockImg.addEventListener("error", (e) => {
      e.currentTarget.src = "images/noneUser.jpg";
    });
  });
}

// 댓글을 보여주는 버튼
const rBtn = document.querySelector(".page_reply_button");
console.log(rBtn);
makeReplyBtn(rBtn);
