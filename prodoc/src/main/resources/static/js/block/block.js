const SERVER_URL = "";

const pageId = "p1"; // 페이지 아이디는 가지고 들어와야함
//어떻게 해결방법이 없나?
let isReady = true;
let isExistData = [];

//일단은 input 이벤트만
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
        const last_event = inputEvent[inputEvent.length - 1];
        // delete last_event.eventType;
        //필요한 값 넣기
        console.log(isExistData);
        updateDBBlock(last_event);
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

/**
 *
 * @param {string} pageId - 페이지아이디
 */
function showBlocks(pageId) {
  fetch(SERVER_URL + "/block/get?pageId=" + pageId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      let parentNode = null;
      blockCount = data.length + 1;

      data.forEach((item) => {
        const { displayId, blockId, content, rowX, parentId } = item;
        const blockObj = updateTemplate({
          displayId,
          type: blockId,
          text: content ? content : "",
          order: rowX,
        });
        parentNode = document.querySelector(`[data-block-id="${parentId}"]`);
        if (parentNode) {
          displayChildBlock(blockObj, parentNode);
        } else {
          displayBlock(blockObj);
        }
      });
      hljs.highlightAll();
    })
    .catch((reject) => {
      console.log(reject);
    });
}

showBlocks(pageId);

/**
 *
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
  await fetch(SERVER_URL + `/block/getOne?displayId=${displayId}`, {
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
 *
 */
function createDBBlock(blockObj) {
  fetch(SERVER_URL + "/block/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
 *  checked:String}} blockObj  - 업데이트할 블럭 정보 OBJECT
 * @returns {number} 0 or 1
 */
function updateDBBlock(blockObj) {
  fetch(SERVER_URL + "/block/update", {
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
 *
 * @param {{displayId:String}} blockObj - 삭제할 블럭이 가지고있는 displayId
 */
function deleteDBBlock(blockObj) {
  fetch(SERVER_URL + "/block/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blockObj),
  })
    .then((resp) => resp.json())
    .then((data) => console.log(data));
}

function getDBBookMark(blockId) {
  fetch(SERVER_URL + `/block/getBookMark?displayId=${blockId}`)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((reject) => {
      console.log("getDBBookMark rejected");
      console.log(reject);
    });
}

/**
 *
 * @param {{title:string,description:string,img_adrs:string}} bookMarkObj
 */
function updateDBBookMark(bookMarkObj) {
  console.log(bookMarkObj);
  fetch(SERVER_URL + `/block/updateBookMark`, {
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
 *
 * @param {String} id - 북마크로 만들 블록의 아이디
 */
async function createBookMark(id) {
  await fetch(SERVER_URL + `/block/createBookMark`, {
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
 *
 * @param {string} url - 북마크할 url
 * @returns {Promise<{title:string,desc:string,img:string,url:string}>}
 */
async function getBookMarkInfo(url) {
  let object = {};
  if (url.length === 0) {
    return;
  }
  await fetch(SERVER_URL + `/block/getMeta?url=${url}`)
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
 * @param {String} displayId - 북마크블럭의 아이디
 * @returns {Promise<{displayId:String,title:String,description:String,imgAdrs:String,url:String}>}
 */
async function getBookMark(displayId) {
  let bookMarkObj = {};
  await fetch(SERVER_URL + `/block/getBookMark?displayId=${displayId}`)
    .then((res) => res.json())
    .then((data) => (bookMarkObj = data))
    .catch((reject) => {
      console.log("getBookMark rejected");
      console.error(reject);
    });
  return bookMarkObj;
}

/**
 *
 * @param {string} displayId - 해당 블럭의 아이디
 * @returns {Promise<{displayId:string,path:string,saveDate:Date,upName:string,newName:string}>}
 */
async function getBlockFile(displayId) {
  let fileObj = {};
  await fetch(SERVER_URL + `/block/getFile?displayId=${displayId}`)
    .then((res) => res.json())
    .then((data) => (fileObj = data))
    .catch((reject) => {
      console.log("getBlockFile rejected..");
      console.error(reject);
    });
  console.log(fileObj);
  return fileObj;
}

async function createFileBlock(displayId) {
  await fetch(SERVER_URL + "/block/createFileBlock", {
    method: "POST",
    body: JSON.stringify({ displayId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 *
 * @param {FormData} formData
 * @returns {Promise<string>}
 */
async function uploadFile(formData) {
  let fileName = null;
  await fetch(SERVER_URL + "/block/uploadFile", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((data) => {
      fileName = data;
      console.log(data);
    })
    .catch((reject) => console.error(reject));
  return fileName;
}

/**
 *
 * @param {{displayId,path,upName,newName}} fileObj
 */
function updateFile(fileObj) {
  fetch(SERVER_URL + "/block/upFileBlock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fileObj),
  });
}
