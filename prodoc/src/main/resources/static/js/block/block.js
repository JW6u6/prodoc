//DATABASE, DATA_PAGE, PAGE
const subscribeTopics = [];

//페이지를 불러오는 함수
async function makeBlockPage(pageId, type = "PAGE", element) {
  //만약 구독을 하고있다면 구독해제
  if (subscribeTopics.length > 0) {
    const subs = subscribeTopics.pop();
    subs.unsubscribe();
  }
  console.log(type === "DATA_PAGE");
  if (type === "DATA_PAGE") {
    document.querySelector(".container").innerHTML = "";
    const parentContainer = await createDataPage(pageId);
    // const element = document.querySelector("dataPage_blocks");
    console.log(parentContainer);
    containerEvent(parentContainer);
    showBlocks(pageId, type, parentContainer);
  } else if (type === "PAGE") {
    containerEvent(container);
    document.querySelector(".container").innerHTML = "";
    showBlocks(pageId, type, element);
  }
  // 페이지에 들어오면 페이지이름으로 구독시작.
  const blockSubscribe = stompClient.subscribe(
    `/topic/collaboration/${pageBlockId}`,
    (data) => {
      const socketDataObj = JSON.parse(data.body);
      console.log(socketDataObj);
      const { eventType, displayId } = socketDataObj;
      if (socketDataObj.upUser === blockSessionUserId) return;

      const targetItem = document.querySelector(
        `[data-block-id="${socketDataObj.targetBlockId}"]`
      );
      const dragItem = document.querySelector(
        `[data-block-id="${socketDataObj.dragBlockId}"]`
      );

      if (eventType === "input") {
        const changedBlock = document
          .querySelector(`[data-block-id="${displayId}"]`)
          .querySelector(".content");
        if (changedBlock) {
          changedBlock.innerText = socketDataObj.content;
        }
      } else if (eventType === "DRAG") {
        console.log(socketDataObj);
        const { dragState } = socketDataObj;
        const targetType = targetItem.dataset.blockType;
        dragEvent({ targetItem, dragItem, dragState, targetType });
      } else if (eventType === "RESETORDER") {
        resetOrder(true);
      } else if (eventType === "CREATEBLOCK") {
        const { template, type, enteredBlockId } = socketDataObj;

        const enteredBlock = document.querySelector(
          `[data-block-id="${enteredBlockId}"]`
        );
        const displayObj = {
          template,
          type,
          element: enteredBlock,
        };
        console.log(displayObj);
        displayBlock(displayObj);
      } else if (eventType === "DELETEBLOCK") {
        document.querySelector(`[data-block-id="${displayId}"]`).remove();
      } else if (eventType === "CHANGETYPE") {
        // 캐릭캐릭체인지
        const blockType = socketDataObj.blockType;
        changeEvent(displayId, blockType);
      } else if (eventType === "FOCUSIN") {
      } else if (eventType === "FOCUSOUT") {
      }
    }
  );

  console.log(blockSubscribe);
  subscribeTopics.push(blockSubscribe);
}

function cusorMove(blockid) {
  let cursor = `div[data-block-id="${blockid}"]`;
  let focusBlock = document.querySelector(cursor);
  if (focusBlock != null) {
    console.log(focusBlock);
    let topLocation = focusBlock.offsetTop;
    console.log(topLocation);
    window.scrollTo({ top: topLocation, behavior: "smooth" });
  }
}
//어떻게 해결방법이 없나?
let isReady = true;
let isExistData = [];

/*
  saveTran Obj의 예시

  const saveTranObj = {
    eventType: "input",
    upUser: "pepsiman",
    displayId,
    content: event.target.innerText,
  };

*/

/**
 * content 저장요청함수
 *
 * @param {Object} obj
 */
function saveTran(obj) {
  isExistData.push(obj);
  save();
  function save() {
    if (isReady) {
      setTimeout(() => {
        //데이터 처리
        //   const lastItem = isExistData.length - 1;
        const inputEvent = [];
        isExistData.forEach((item) => {
          if (item.eventType == "input") {
            inputEvent.push(item);
          }
        });
        // delete last_event.eventType;
        //필요한 값 넣기
        sendData(isExistData);
        //  updateDBBlock(last_event);
        isExistData = [];
        isReady = true;
        if (isExistData.length != 0) {
          save();
        }
      }, 1000);
      isReady = false;
    }
  }
}

function sendData(isExistData) {
  const groupedData = {};
  isExistData.forEach((item, idx) => {
    const { eventType, displayId, ...rest } = item;
    if (!groupedData[eventType]) {
      groupedData[eventType] = {};
    }
    if (!groupedData[eventType][displayId]) {
      groupedData[eventType][displayId] = [];
    }
    groupedData[eventType][displayId].push(rest);
  });
  console.log(groupedData);

  const groupedArray = Object.keys(groupedData).map((eventType) => ({
    eventType,
    data: groupedData[eventType],
  }));
  groupedArray.forEach((obj) => {
    const { eventType, data } = obj;
    for (let displayId in data) {
      const dataList = data[displayId];
      const lastObjOfList = dataList[dataList.length - 1];
      updateDBBlock({ displayId, workId, ...lastObjOfList });
      const socketEventObj = {
        eventType,
        displayId,
        workId,
        ...lastObjOfList,
      };
      sendSocketEvent(socketEventObj);
    }
  });
}

//소켓에 이벤트를 보내는 함수
function sendSocketEvent(socketEventObj) {
  if (stompClient.connected) {
    stompClient.publish({
      destination: `/topic/collaboration/${pageBlockId}`,
      body: JSON.stringify(socketEventObj),
    });
    console.log("send");
  } else {
    console.log("stomp is not connected");
  }
}

/**
 *  페이지 요청함수
 * @param {string} pageId - 페이지아이디
 */

function showBlocks(pageId, type = "PAGE") {
  let container = null;
  if (type === "DATA_PAGE") {
    container = document.querySelector(".dataPage_blocks");
    container.innerHTML = "";
  } else if (type === "PAGE") {
    container = document.querySelector(".container");
    container.innerHTML = "";
  }

  fetch("/block/get?pageId=" + pageId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(async (data) => {
      // 트리탐색 재귀
      async function displayChildBlock(blocks, childBlocks) {
        for (const block of blocks) {
          const displayId = block.dataset.blockId;
          for (let i = 0; i < childBlocks.length; i++) {
            if (displayId === childBlocks[i].parentId) {
              await asyncChildDisplay(childBlocks[i], block);
              childBlocks.splice(i, 1);
              i--;
            }
          }
        }
      }
      blockCount = data.length + 1;
      let parentBlocks = [];
      let childBlocks = [];

      data.forEach((item) => {
        const {
          displayId,
          blockId,
          content,
          rowX,
          parentId,
          color,
          backColor,
        } = item;
        const blockObj = {
          displayId,
          type: blockId,
          text: content ? content : "",
          order: rowX,
          parentId,
          color,
          backColor,
        };
        if (blockObj.parentId) {
          childBlocks.push(blockObj);
        } else {
          parentBlocks.push(blockObj);
        }
      });
      for (const block of parentBlocks) {
        await asyncDisplay(block, type);
      }
      const displayedBlock = document.querySelectorAll(".prodoc_block");
      displayChildBlock(displayedBlock, childBlocks);
    })
    .catch((reject) => {
      console.log(reject);
    });
}

async function asyncDisplay(block, type, element) {
  const template = await updateTemplate(block);
  displayBlock({ template, type, element });
}

async function asyncChildDisplay(block, parent) {
  const temp = await updateTemplate(block);
  displayChildBlock(temp, parent);
}

/**
 * displayId의 블럭의 정보를 요청하는 함수
 * @param {string} displayId
 * @returns {Promise<{
 * displayId: String,
 * parentId: String,
 * originId: String,
 * pageId: String,
 * rowX: Number,
 * colY: Number,
 * blockId: String,
 * width: Number,
 * height: Number,
 * creUser: String,
 * creDate: String,
 * upUser: String,
 * upDate: String,
 * content: String,
 * mentionList: String,
 * color: String,
 * backColor: String,
 * checked:string}>}
 */
async function getOneBlock(displayId) {
  let block = {};
  await fetch(`/block/getOne?displayId=${displayId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      block = data;
    })
    .catch((reject) => {
      console.log(reject);
    });

  return block;
}

/**
 * 생성된 블럭을 DB에 넣는 함수
 *
 *  @param {Object} blockObj 생성된 블럭정보 Obj
 *  @param {String} blockObj.displayId 새로운 블럭의 displyId
 *  @param {String} blockObj.pageId 블럭이 생성된 pageId
 *  @param {Number} blockObj.rowX 블럭의 인덱스입니다.
 *  @param {String} blockObj.blockId 블럭의 blockId입니다 (type)
 *  @param {String} blockObj.creUser 블럭을 만든 사람의 이메일입니다.
 *  @param {String} blockObj.content 블럭의 내용입니다.
 *  @param {string} blockObj.parentId 블럭의 부모입니다.
 *
 */
async function createBlock2DB(blockObj) {
  blockObj.workId = workBlockId;
  await fetch("/block/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      allow: "POST",
    },
    body: JSON.stringify(blockObj),
  }).catch((reject) => {
    console.log("createDBBlock rejected");
    console.log(reject);
  });
}

/**
 * null이 아닌값만 업데이트
 * @param {{
 *  displayId:String,
 *  parentId:String,
 *  upUser:String,
 *  blockId:String,
 *  content:String,
 *  rowX:Number,
 *  colY:Number,
 *  checked:String,
 *  color:string,
 *  backColor:string
 *  workId:string}} blockObj  - 업데이트할 블럭 정보 OBJECT
 * @returns {number} 0 or 1
 */
function updateDBBlock(blockObj) {
  blockObj.workId = workBlockId;
  blockObj.pageId = pageBlockId;
  console.log(blockObj);
  fetch("/block/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blockObj),
  }).catch((reject) => {
    console.log("updateDBBlock rejected");
    console.log(reject);
  });
}

/**
 *  블럭 삭제를 요청하는 함수
 * @param {{displayId:String,workId:string}} blockObj - 삭제할 블럭이 가지고있는 displayId
 */
function deleteDBBlock(blockObj) {
  blockObj.workId = workBlockId;
  blockObj.pageId = pageBlockId;
  fetch("/block/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blockObj),
  })
    .then((resp) => resp.json())
    .then((data) => console.log(data));
}

/**
 *  북마크 업데이트를 요청하는 함수
 * @param {{displayId:string,title:string,description:string,imgAdrs:string,url:string,workId:string}} bookMarkObj
 */
async function updateDBBookMark(bookMarkObj) {
  await fetch(`/block/updateBookMark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookMarkObj),
  }).catch((reject) => {
    console.log("updateDBBookMark rejected");
    console.log(reject);
  });
}

/**
 * 북마크 DB생성을 요청하는 함수
 * @param {String} id - 북마크로 만들 블록의 아이디
 */
async function createBookMark(id) {
  await fetch(`/block/createBookMark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ displayId: id }),
  }).catch((reject) => {
    console.log("createBookMark rejected");
    console.log(reject);
  });
}

/**
 *  매개변수로 주어진 url로 크롤링 요청을 보내는 함수
 * @param {string} url - 북마크할 url
 * @returns {Promise<{title:string,desc:string,img:string,url:string}>}
 */
async function getBookMarkInfo(url) {
  let object = {};
  if (url.length === 0) {
    return;
  }
  await fetch(`/block/getMeta?url=${url}`)
    .then((res) => res.json())
    .then((data) => {
      object = data;
    })
    .catch((reject) => {
      console.log("getBookMarkInfo rejected");
      console.log(reject);
    });

  return object;
}

/**
 * DB에 있는 북마크 정보를 요청하는 함수
 * @param {String} displayId - 북마크블럭의 아이디
 * @returns {Promise<{displayId:String,title:String,description:String,imgAdrs:String,url:String}>}
 */
async function getBookMark(displayId) {
  let bookMarkObj = {};
  await fetch(`/block/getBookMark?displayId=${displayId}`)
    .then((res) => res.json())
    .then((data) => (bookMarkObj = data))
    .catch((reject) => {
      console.log("getBookMark rejected");
      console.error(reject);
    });
  return bookMarkObj;
}

/**
 * 파일블럭의 내용물을 가져오는 함수
 * @param {string} displayId - 해당 블럭의 아이디
 * @returns {Promise<{displayId:string,path:string,saveDate:Date,upName:string,newName:string}>}
 */
async function getBlockFile(displayId) {
  let fileObj = {};
  await fetch(`/block/getFile?displayId=${displayId}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      fileObj = data;
    })
    .catch((reject) => {
      console.log("getBlockFile rejected..");
      console.error(reject);
    });
  return fileObj;
}

/**
 * 파일 블럭으로 전환했을때의 함수.
 * @param {string} displayId - 해당 블럭의 아이디
 */
async function createFileBlock(displayId) {
  await fetch("/block/createFileBlock", {
    method: "POST",
    body: JSON.stringify({ displayId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 파일 업로드 함수
 * @param {FormData} formData - 파일 데이터
 * @returns {Promise<string>}
 */
async function uploadFile(formData) {
  let fileName = null;
  await fetch("/block/uploadFile", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
      fileName = data;
    })
    .catch((reject) => console.error(reject));
  return fileName;
}

/**
 * 파일을 업데이트하는 함수.
 * @param {{displayId,path,upName,newName}} fileObj - 파일DB의 구성요소
 */
async function updateFile(fileObj) {
  await fetch("/block/upFileBlock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fileObj),
  });
}

/**
 *  해당아이디 블럭의 댓글 리스트를 불러오는 함수
 *
 * @param {string} blockId - 댓글버튼이 클릭된 댓글
 * @returns {Promise<[{
 *          pageId:string,
 *          content:string,
 *          creUser:string,
 *          creDate:Date,
 *          upDate:string,
 *          displayId:string,
 *          replyId:string,
 *          platform:string,
 *          profile:string}]>
 * }
 */
async function getBlockreplyList(blockId) {
  let replyData = [];
  await fetch(`/reply/block?displayId=${blockId}`)
    .then((res) => res.json())
    .then((data) => (replyData = [...data]));

  return replyData;
}

/**
 * 댓글을 DB에 등록하는 함수
 * @param {{creUser:string,
 *          content:string,
 *          displayId:string,
 *          mentionList?:string,
 *          pageId:string}} replyObj
 */
function registReply(replyObj) {
  const replyId = self.crypto.randomUUID();
  replyObj.replyId = replyId;
  fetch("/reply/regist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(replyObj),
  });

  return replyId;
}

async function deleteReply(replyId, userId) {
  let resultObj = null;
  await fetch("/reply/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ replyId, creUser: userId }),
  })
    .then((res) => res.json())
    .then((result) => {
      resultObj = result;
    });
  return resultObj;
}

/**
 *  페이지 리스트를 불러오는 함수
 * @param {string} pageId
 * @returns {Promise<[{replyId:string,
 *                     pageId:string,
 *                     displyId:string
 *                     content:string,
 *                     creUser:string,
 *                     creDate:string,
 *                     upDate:string,
 *                     mentionList:string}]>}
 */
async function getPageReplyList(pageId) {
  let replyData = [];

  await fetch(`/reply/page?pageId=${pageId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      replyData = data;
    });

  return replyData;
}

// public String parentID;	//DB의 부모 페이지 id
// 		public String email;
// 	public String pageNum;	//페이지넘버링
// 		public String displayId;
// 	public String blockNum;	//블럭넘버링
//✔️public String result;	//생성성공시 페이지 아이디 반환

/**
 *
 * @param {{parentId:string,email:string,pageNum:String,displayId:string,blockNum:Number}} dbObj
 */
async function createDB2DBblock(dbObj) {
  console.log(dbObj);
  await fetch(`/InsertDBCase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dbObj),
  })
    .then((res) => res.text())
    .then((result) => {
      console.log(result);
    });
}
