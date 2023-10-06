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
    container.insertAdjacentElement("afterend", replyBox);
    replyTarget = document.querySelector(".page_reply");
    makeReplyList(replyTarget);
  }
}
//페이지 댓글 리스트 만드는 함수
async function makeReplyList(appendTarget) {
  const replylist = await getPageReplyList(workBlockId);
  replylist.forEach((reply) => {
    const date = reply.upDate ? reply.upDate : reply.creDate;
    const temp = makeReplyBlock(reply.creUser, reply.content, date);
    appendTarget.insertAdjacentHTML("beforeend", temp);
  });
}

// 댓글을 보여주는 버튼
const rBtn = document.querySelector(".reply_btn");
makeReplyBtn(rBtn);
