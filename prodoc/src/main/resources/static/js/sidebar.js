const sidebar = document.querySelector('#side');

init();

const wNameList = ["workType", "publicCheck"];
let subCheck = false; //하위 워크스페이스 생성인지 체크하기 위한......이렇게까지 해야되나

//전체 JS 기능 실행함수
function init() {
    let email = document.querySelector("#side input.logUser").value;
    workList(email);
    document.querySelector("#insert-page").addEventListener("click", newPage);
}
let wp = document.querySelector("#wsPrivate");
let pa = document.querySelector("#priArrow");
let wt = document.querySelector("#wsType");
let ta = document.querySelector("#typeArrow");
let workModal = document.querySelector("#workModal");
let pageModal = document.querySelector("#pageModal");

//인사이트 내 사이드바 워크스페이스 목록 불러오기(AJAX)
function workList(email) {
    let url = '/workList?email=' + email;
    fetch(url, {
            method: 'GET'
        })
        .then(response => {
            return response.json();
        })
        .then((data) => {
            let works = side.querySelectorAll('.Work');
            works.forEach(work => {
                work.remove()
            })
            data.forEach(item => {
                let side = document.querySelector('#side');
                let text = `<div class= "Work" data-id="${item.workId}"><span class="workListShow">ㅇ</span><span class="workName" draggable="true">${item.workName}</span><span onclick="newPageModal(event)" class="add"><img class="plus" src="/images/plus.svg" width="15px" height="15px"></span>
                            <img class="setting" src="/images/settings.svg" width="15px" height="15px"><div class = "pageMain"></div>
                            <input type="hidden" class ="num" value="0"></div>`
                side.insertAdjacentHTML("beforeend", text);
            })
            document.querySelectorAll('#side .workListShow').forEach(works => {
                works.addEventListener('click', function (e) {
                    let target = e.target;
                    if (target.classList.contains("clicked")) {
                        target.classList.remove("clicked");
                        let pageDiv = target.parentElement.querySelector('.pageMain');
                        pageDiv.innerHTML = "";
                    } else {
                        target.classList.add("clicked");
                        let workClick = e.currentTarget.parentElement.dataset.id;
                        pageList(workClick, target);
                    }
                })
            })
            document.querySelectorAll('#side .workName').forEach(items => {
                items.addEventListener("dragstart", dragStart);
                items.addEventListener("dragover", dragOver);
                items.addEventListener("dragend", dragEnd);
                items.addEventListener("drop", dropItem);
            })

            let set = document.querySelectorAll('.setting');
            set.forEach(async (tag) => {
                let setWId = tag.closest('.Work').dataset.id;
                let SettingAuth = await memberCheck(setWId);
                if (SettingAuth == 'OWNER' || SettingAuth == 'MANAGER') {
                    tag.addEventListener('click', workSetting);
                } else if (SettingAuth == 'NOMAL') {
                    let targetTag = tag;
                    targetTag.removeEventListener('click', workSetting);
                    targetTag.remove();
                }
            })

            let list = side.querySelectorAll('.workName');
            list.forEach(targetDiv => {
                //워크스페이스 부모 아이디가 있는지 없는지 불러와서 있으면 막음

                //원래 우클릭하면 일어나는 이벤트 막음(사이드 name에서만 막음)
                targetDiv.oncontextmenu = function () {
                    return false;
                }
                //우클릭하면 input에서 makeWid이벤트 일어나게함
                targetDiv.addEventListener('mouseup', function (e) {
                    if (e.which == 3 || e.button == 2) {
                        makeWid(e);
                    }
                })
                targetDiv.addEventListener('contextmenu', async function (e) {
                    let workId = document.querySelector('#wid').value;

                    let submemberAuth = await memberCheck(workId);
                    let parent = await selectOneWork(workId);
                    if (submemberAuth == 'OWNER' || submemberAuth == 'MANAGER') {
                        if (parent.parentId == null) {
                            contextWorkSpace(e);
                        } else if (parent.parentId != null) {
                            alert('상위 워크스페이스에서 생성해 주십시오.');
                            closeSubMenu();
                        }
                    } else {
                        closeSubMenu();
                    }
                });
            })

        })
}

function workSetting(e) {
    setWork(e);
    typeChange(e);
    makeWid(e);
}

function dragStart(e){
    e.target.classList.add("dragSide");
    e.dataTransfer.dropEffect = "copy";
    e.dataTransfer.setData("text", e.target.innerHTML);
}

function dragOver(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const targetItem = e.currentTarget;
    const targetHeight = targetItem.offsetHeight;
    const {
        offsetX,
        offsetY
    } = e;
    const targetWidth = targetItem.offsetWidth;
    const center = targetHeight / 2;
    const side = targetWidth - 50;
    let dragState = null;
    if (offsetX > side && dragState !== DRAG_STATE.SIDE) {
        dragState = DRAG_STATE.SIDE;
    } else if (
        offsetY > center &&
        offsetX < side &&
        dragState !== DRAG_STATE.BOTTOM
    ) {
        dragState = DRAG_STATE.BOTTOM;
    } else if (
        offsetY < center &&
        offsetX < side &&
        dragState !== DRAG_STATE.TOP
    ) {
        dragState = DRAG_STATE.TOP;
    }
}

function insertAfter(referenceNode, newNode) {
    if (!!referenceNode.nextSibling) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    } else {
        referenceNode.parentNode.appendChild(newNode);
    }
}

function dropItem(event){
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const dragItem = document.querySelector(".dragging")
    console.log(dragItem);
    const targetItem = event.currentTarget;
    if(targetItem.className === 'workName'){
        let workId = targetItem.parentElement.dataset.id;
        let pageId = dragItem.parentElement.dataset.id;
        let val = {
                "workId" : workId
              , "pageId" : pageId
                };
        let url = "/pageUpdate"
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(val)
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err))
    }
}

function dropPage(event){
    event.stopPropagation();
    event.preventDefault();
    const dragItem = document.querySelector(".dragging").parentElement;
    const targetItem = event.currentTarget;
    const pageMain = event.currentTarget.parentElement.parentElement;
    const targetHeight = event.target.offsetHeight;
    
    console.log(dragItem);
    console.log(targetItem.parentElement);
    const {
        offsetX, offsetY
    } = event;
    const center = targetHeight / 2;
    console.log(offsetY , center)

    let targetArea = targetHeight/4 ;   
    if(offsetY < center + targetArea && offsetY > center - targetArea){ 
        console.log("으아아아앙아아아앆!!")
        let workId = targetItem.closest('.Work').dataset.id;
        let pageId = dragItem.dataset.id;
        let parentId = targetItem.closest('.Page').dataset.id;
        let dragLevel = dragItem.closest('.Page').dataset.level;
        let targetLevel = targetItem.closest('.Page').dataset.level;
        let exceptMove;
        console.log(dragLevel,targetLevel);
        if(dragLevel<targetLevel){
            exceptMove = targetItem.closest('.Page[data-level="'+targetLevel+'"]').dataset.id;
            console.log(exceptMove);
        }
        if(parentId == pageId || parentId == exceptMove || targetLevel == 4){
            console.log("안돼!!!!!!!")
            return;
        }
        let val = {
                "workId" : workId
              , "parentId" : parentId
              , "pageId" : pageId
                };
        let url = "/inPageUpdate"
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(val)
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err))
    } else 
    if(offsetY > center + targetArea){
        insertAfter(dragItem, targetItem.parentElement);
        console.log('뒤')
        let pageId = dragItem.dataset.id;
        let numbering = targetItem.parentElement.dataset.number;
        let workId = targetItem.closest('.Work').dataset.id;
        let parentId = targetItem.parentElement.parentElement.parentElement.dataset.id;
        if(parentId == workId){
            parentId = "";
        }
        console.log(workId,numbering,pageId,parentId)
        let url = "/pagePlus"
        let val = {
                 "workId" :  workId
                ,"numbering" : numbering
                ,"pageId" : pageId
                ,"parentId" : parentId
                };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(val)
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err))
  
    }else {
        pageMain.insertBefore(dragItem, targetItem.parentElement);
        console.log('앞')
        let pageId = dragItem.dataset.id;
        let numbering = targetItem.parentElement.dataset.number;
        let workId = targetItem.closest('.Work').dataset.id;
        let parentId = targetItem.parentElement.parentElement.parentElement.dataset.id;
        if(parentId == workId){
            parentId = "";
        }
        console.log(workId,numbering,pageId,parentId)
        let url = "/pagePlus"
        let val = {
                 "workId" :  workId
                ,"numbering" : numbering
                ,"pageId" : pageId
                ,"parentId" : parentId
                };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(val)
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err))
    }
    
}
function dragEnd(event){
    event.target.classList.remove("dragSide");
    event.target.classList.toggle("dragging");
    console.log(event.target);
}

//setting 분리하려고 nameArea 아래에 input:hidden으로 워크아이디 넣음
function makeWid(e) {
    let workId = e.currentTarget.closest(".Work").dataset.id;
    let wInput = document.createElement("input");
    wInput.type = "hidden";
    wInput.id = "wid";
    wInput.value = workId;

    let old = document.getElementById("nameArea").lastChild;

    if (old.id == "wid") {
        old.replaceWith(wInput);
    } else {
        document.querySelector("#nameArea").appendChild(wInput);
    }
}

// 선택한 워크스페이스와 DB내의 워크스페이스 일치과정.(DB ID로 조회하는거 추가해야함)
function selectWork(workClick) {
    let insertDiv = target.parentElement.querySelector('.pageMain');
    let url = '/workList';
    fetch(url, {
            method: 'GET'
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                if (wId == data[i]) {
                    // console.log(data[i])
                    //워크 ID 들고와서 일치시켰으니 페이지 정보 띄우기.
                }
            }
        })
}

//새로운 워크스페이스 삽입 모달창생성(+ 클릭시)
async function newWork() {
    workModal.style.display = "block";
    document.body.style.overflow = "hidden";
    document.querySelector('#typeArea').classList.remove('hide');
    document.querySelector('#deleteBtn').classList.add('hide');
    document.querySelector('#ownArea').classList.add('hide');
    document.querySelector('#teamToggleArea').classList.add('hide');
    document.querySelector('#pubArea').classList.remove('hide');
    document.querySelector('#nameArea').classList.remove('hide');
    document.querySelector('#delCheckArea').classList.add('hide');
    document.querySelector('#memberArea').classList.add('hide');
    let inv = document.querySelector('#inviteUser')
    let type = document.querySelector('#typeArea'); //타입 영역
    document.querySelector('#btnArea').classList.remove('hide');
    inv.classList.add('hide');
    type.classList.remove('hide');
    type.addEventListener('change', typeChange);

    let joinList = document.querySelector('#beforeJoin');
    if (joinList) {
        joinList.classList.add('hide');
    }
    let name = document.querySelector('#wsName');
    name.value = '';
    name.readOnly = false;
    let creBtn = document.createElement('button');

    if (subCheck === true) {
        autoCheckList();
        let parentId = document.querySelector('#wid');
        let parent = await selectOneWork(parentId.value);
        type.value = parent.workType;

        let event = new Event("typeChange");
        type.addEventListener('typeChange', typeChange);
        type.dispatchEvent(event);
        type.addEventListener('change', noChange);

    } else {
        type.removeEventListener('change', noChange);
    }

    creBtn.id = 'wsCreate';
    creBtn.textContent = '생성';
    document.querySelector('#btnArea').firstElementChild.replaceWith(creBtn);
    document.querySelector('#wsCreate').addEventListener('click', newWorkSpace);

}

//하위 워크스페이스 만들때 상위 워크스페이스 타입 따라가고 따로 팀/개인 못바꾸게 만듦
async function noChange() {
    let event = new Event("typeChange");
    alert('하위 워크스페이스는 워크스페이스 타입을 바꿀 수 없습니다.');
    let type = document.querySelector('#wsType');

    let parentId = document.querySelector('#wid');
    let parent = await selectOneWork(parentId.value);

    type.value = parent.workType;
    type.addEventListener('typeChange', typeChange);
    type.dispatchEvent(event);
}


//하위 워크스페이스로 생성하는게 아니라 새 워크스페이스 생성을 누르는 경우 값을 비워줌
document.querySelector('#sidebar').children[2].addEventListener('click', function (e) {
    let wid = document.querySelector('#wid');

    if (wid) {
        wid.value = "";
    }
    subCheck = false;
});

//
// 인사이트 내 사이드바에 페이지 목록 불러옴
function pageList(wId, target) {
    let insertDiv = target.parentElement.querySelector(".pageMain");
    let url = "/pageList?workId=" + wId;
    fetch(url)
        .then((res) => {
            return res.json();
        })
        .then(data => {
            data.forEach(item => {
                console.log(item);
                let text = `<div class= "Page" data-id="${item.pageId}"  data-name="${item.pageName}" data-level="2" data-number="${item.numbering}" ><span class="pageListShow">ㅇ</span><span class="pageName" draggable="true">  ${item.pageName}</span><span onclick="newPageModal(event)" class="add">
                            <img class="plus" src="/images/plus.svg" width="15px" height="15px"></span>
                            <img class="editPN" src="/images/edite.svg" width="15px" height="15px"><div class = "pageMain"></div>
                            </div>`
                insertDiv.insertAdjacentHTML("beforeend", text);
            })
            document.querySelectorAll('#side .pageListShow').forEach(Pages => {
                Pages.addEventListener('click', function (e) {
                    let clickSession = sessionStorage.getItem("clickedList")
                    if(clickSession == null){
                        clickSession = [];
                    }else{
                        clickSession = JSON.parse(clickSession);
                    }
                    let target = e.target;
                    if (target.classList.contains("clicked")) {
                        target.classList.remove("clicked");
                        let pageDiv = target.parentElement.querySelector('.pageMain');
                        pageDiv.innerHTML = "";
                    } else {
                        target.classList.add("clicked");
                        let pageClick = e.currentTarget.parentElement.dataset.id;
                        clickSession.push(pageClick)
                        sessionStorage.setItem("clickedPageList",JSON.stringify(clickSession))
                        pageInPage(pageClick, target);
                    }
                })
                document.querySelectorAll('#side .pageName').forEach(items => {
                    items.addEventListener("dragstart", dragStart)
                    items.addEventListener("dragover", dragOver);
                    items.addEventListener("dragend", dragEnd);
                    items.addEventListener("drop", dropPage);
                })
            })
            document.querySelectorAll('#side .pageName').forEach(Pages => {
                Pages.addEventListener('click', function (e) {
                    let pageId = e.currentTarget.parentElement.dataset.id;
                    selectPage(pageId);
                })
            })
            
            //페이지 이름 변경 모달 열기 :: 은주
			document.querySelectorAll(".editPN").forEach(tag => {
				let pid = tag.parentElement.dataset.id
				let pname = tag.parentElement.dataset.name
				tag.addEventListener('click', function(e){
					PNmod.className ="view";
					PNmod.dataset.id= pid;
					let newPName = document.querySelector("#editPageMod input");
					 newPName.value = pname;
				});
			});
        })
        .catch((err) => console.log('err: ', err));
}

//페이지 이름 변경 모달 내 클릭 이벤트 :: 은주
let PNmod = document.querySelector("#editPageMod");
document.querySelector("#newPageNameBtn").addEventListener('click', function(e){
	let value = this.previousElementSibling.value;
	let id = this.closest("div").dataset.id;
	let URL = `/pageNewName?pageId=${id}&pageName=${value}`;
	fetch(URL, {
		method: "GET",
	    headers: {
	      "Content-Type": "application/json",
	    }
	}).then(response => response.json())
	.then(res => {
		if(res.result){
			document.querySelectorAll("#side .Page").forEach(pageitem => {
				if(pageitem.dataset.id == id){
					pageitem.children[1].innerText = value;
					pageitem.dataset.name = value;
				}
			});
		}else{
			alert('알 수 없는 이유로 페이지 이름 변경에 실패하였습니다.');
		}
		PNmod.className ="hide";
	}).catch(err => console.log(err));
});

// 페이지 선택시 PID 불러오기 + 리스트노출.
function selectPage(pageId) {
  let url = "/pageInfo?pageId=" + pageId;
    fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            data.forEach(async(item) => {
                //이미 있으면 제거
                const title = document.querySelector(".pageHead");

                if (title) {
                    title.remove();
                }
        let app = document.querySelector(".container");
        let pageTitle = `<div class="pageHead"><span id="TitleName">"${item.pageName}"</span><input type="text" id="TitleWid" data-pageId="${item.pageId}" value="${item.workId}"/> </div>`;
        app.insertAdjacentHTML("beforebegin", pageTitle);
        // 페이지 타입 체크
        let type = await pageTypeCheck(pageId);
        console.log("페이지 타입 체크", type);
        if(type=="DATABASE"){
            // 데이터베이스일 때
            openDatabase(pageId);
        }else if(type=="DATA_PAGE"){
            // DB의 하위페이지일 때
            createDataPage(pageId);
            makeBlockPage(pageId, type);
        }else {
            // 일반 페이지일 때
            //페이지 뿌려주기
            pageBlockId = pageId;
            workBlockId = item.workId;
            makeBlockPage(pageId, type);
        }


      });
    });
}
// 새로운 페이지 생성.
function newPage() {
    let workId = document.querySelector('#workId').value;
    let parentId = document.querySelector('#parentId').value;
    let caseId = document.querySelector('#caseId').value;
    let creUser = document.querySelector('#loginUser').value;
    let pageName = document.querySelector('#pgName').value;
    //let parentLevel = document.querySelector('#parentLevel').value;
    let val = {
        parentId,
        pageName,
        creUser,
        workId,
        caseId
    }
    console.log(val);
    let url = '/pageInsert';
    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(val)
        })
        .then(response => response.text())
        .then((pageId) => {
            if (parentId) {
                let pId = document.querySelector('#parentId').value;
                let parent = document.querySelector('.Page[data-id="' + pId + '"]');
                let insertDiv = parent.querySelector('.pageMain');
                insertDiv.innerHTML = "";
                pageInPage(parentId, insertDiv);
            } else {
                let wId = document.querySelector('#workId').value;
                let works = document.querySelector('.Work[data-id="' + wId + '"]');
                let insertDiv = works.querySelector('.pageMain');
                insertDiv.innerHTML = "";
                pageList(workId, insertDiv);
            }
            // sendSocket(pageId);
            closeModal();
        })
        .catch(err => console.log(err));
}



//새로운 페이지 삽입 모달창생성(+ 클릭시)
function newPageModal(event) {
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    let wId = event.target.closest('.Work').dataset.id;
    let pId = '';
    let = '';
    if (event.target.closest('.pageMain')) {
        pId = event.target.closest('.Page').dataset.id;
    }
    let url = '/workId?workId=' + wId;
    fetch(url)
        .then(res => {
            return res.text();
        })
        .then((data) => {
            let workId = document.querySelector('#workId');
            workId.value = wId;
            let parentId = document.querySelector('#parentId');
            parentId.value = pId;
        })
        .catch((err) => console.log('err: ', err));
}

//페이지 안의 페이지 여는 기능
function pageInPage(pId, target) {
    let insertDiv = target.parentElement.querySelector('.pageMain');
    let url = '/pageInPage?pageId=' + pId;
    let parentLevel = insertDiv.parentElement.dataset.level;
    let childLevel = Number(parentLevel)+Number(1);
    console.log(parentLevel)
    fetch(url)
        .then(res => {
            return res.json();
        })
        .then(data => {
            data.forEach(item => {
                    let addBtn = "";
                    if (childLevel < 4) {
                        addBtn = `<span onclick="newPageModal(event)" class="add"><img class="plus" src="/images/plus.svg" width="15px" height="15px"></span>`;
                    }
                    let text = `<div class= "Page" data-id="${item.pageId}" data-level="${childLevel}"><span class="pageListShow">ㅇ</span><span class="pageName" draggable="true">
                    ${item.pageName}</span><span class="workIdVal">${item.workId}</span>${addBtn}<div class="pageMain"></div> </div>`
                    insertDiv.insertAdjacentHTML("beforeend", text)
            })
            insertDiv.querySelectorAll('.pageName').forEach(items => {
                items.addEventListener("dragstart", dragStart)
                items.addEventListener("dragover", dragOver);
                items.addEventListener("dragend", dragEnd);
                items.addEventListener("drop", dropPage);
            })
            insertDiv.querySelectorAll(".pageListShow").forEach((Pages) => {
                Pages.addEventListener("click", function (e) {
                    let target = e.target;
                    console.log(target);
                    if (target.classList.contains("clicked")) {
                        target.classList.remove("clicked");
                        let pageDiv = target.parentElement.querySelector(".pageMain");
                        pageDiv.innerHTML = "";
                    } else {
                        target.classList.add("clicked");
                        let pageClick = e.currentTarget.parentElement.dataset.id;
                        pageInPage(pageClick, target);
                    }
                });
            });
            document.querySelectorAll('#side .pageName').forEach(Pages => {
                Pages.addEventListener('click', function (e) {
                    let pageId = e.currentTarget.parentElement.dataset.id;
                    console.log(pageId);
                    selectPage(pageId);
                })
            })
        })
}

function clickPage() {
    document.querySelectorAll("#side .pageName").forEach((Pages) => {
        Pages.addEventListener("click", function (e) {
            let target = e.target;
            console.log(target);
            if (target.classList.contains("clicked")) {
                target.classList.remove("clicked");
                let pageDiv = target.parentElement.querySelector(".pageMain");
                pageDiv.innerHTML = "";
            } else {
                target.classList.add("clicked");
                let pageClick = e.currentTarget.parentElement.dataset.id;
                pageInPage(pageClick, target);
            }
        });
    });
}
//모달창 닫는 기능
function closeSideModal() {
    workModal.style.display = "none";
    pageModal.style.display = "none";
    document.body.style.overflow = "auto";
    document.querySelector('#caseId').value = "";
    document.querySelector('#workId').value = "";
    document.querySelector('#parentId').value = "";
    document.querySelector('#pgName').value = "";

    document.querySelector('#wsType').removeEventListener('change', noChange);
    document.querySelector('#wsType').removeEventListener('change', setTypeChange);
    document.querySelector('#wsType').removeEventListener('click', setTypeChange);
    let input = document.querySelectorAll('#workModal input');
    input.forEach(item => {
        if (item.id != 'loginUser') {
            item.value = '';
        }
    })

    //워크스페이스 모달창 리셋
    for (let field of wNameList) {
        let wselect = document.querySelectorAll('select[name="' + field + '"]');
        wselect.forEach((item) => {
            item.options[0].selected = true;
        })
        let resetTable = document.querySelectorAll("#workModal > table");

        resetTable.forEach((item) => {
            item.children.remove();
        });
        subCheck = false;
    }
}


//페이지-템플릿 목록 띄움
function template() {
    temPage.style.display = "block";
    pageContent.style.display = "none";
    dbPage.style.display = "none";
}
//페이지-DB 목록 띄움
function database() {
    dbPage.style.display = "block";
    pageContent.style.display = "none";
    temPage.style.display = "none";
}
//페이지-템플릿 선택시 페이지생성에 템플릿 종류 삽입
function selectTemp(event) {
    let temp = event.currentTarget.innerText;
    let caseId = document.querySelector("#caseId");
    caseId.value = temp;
}
//페이지- DB 선택시 페이지생성에 DB 종류 삽입
function selectDb(event) {
    // let selId = event.currentTarget.id;
    let db = event.currentTarget.innerText;
    let caseId = document.querySelector("#caseId");
    caseId.value = db;
}
wt.addEventListener("click", (e) => {
    ta.classList.toggle("turn");
});
wt.addEventListener("focusout", (e) => {
    ta.classList.remove("turn");
});
wp.addEventListener("click", (e) => {
    pa.classList.toggle("turn");
});
wp.addEventListener("focusout", (e) => {
    pa.classList.remove("turn");
});

// //웹 소켓
// function sendSocket(pageId) {
//     stompClient.publish({
//         destination: "/app/updateCmd",
//         body: JSON.stringify({'cmd': 'createPage',content:pageId})
//     });
// }
//======================================================================

//하위 워크스페이스 생성 우클릭 메뉴 이벤트
function contextWorkSpace(e) {
    let subMenu = document.querySelector("#subWorkMenu");
    subMenu.style.display = "block";
    subMenu.style.top = e.pageY + "px";
    subMenu.style.left = e.pageX + "px";
}

document.addEventListener('click', closeSubMenu);

function closeSubMenu() {
    let subMenu = document.querySelector('#subWorkMenu');

    subMenu.style.display = 'none';
    subMenu.style.top = null;
    subMenu.style.left = null;

}

document.querySelector('#subWorkMenu').addEventListener('click', function (e) {
    subCheck = true;
    newWork();
})

async function memberCheck(workId) {
    let members = await memberList(workId);
    let users = document.querySelector('#loginUser').value;
    let userAuth;

    members.forEach(item => {
        if (item.email == users) {
            userAuth = item.auth;
        }
    })
    return userAuth;
}

//워크스페이스 설정창 여는..거
async function setWork(e) {
    subCheck = false;
    workModal.style.display = 'block';
    document.body.style.overflow = "hidden";
    document.querySelector('#wsName').readOnly = false;

    let workId = e.currentTarget.closest('.Work').dataset.id;
    let infoResult = await selectOneWork(workId);
    let membAuth = await memberCheck(workId);


    await listWorkJoin(workId);

    let tTog = document.querySelector('#teamToggleArea');
    let name = document.querySelector('#nameArea'); //워.스.이름영역
    let pub = document.querySelector('#pubArea'); //공개범위 영역
    let type = document.querySelector('#typeArea'); //타입 영역
    let own = document.querySelector('#ownArea'); //소유자 영역
    let del = document.querySelector('#deleteBtn'); //삭제로 넘어가는 버튼
    let delCheck = document.querySelector('#delCheckArea'); //삭제확인
    let inv = document.querySelector('#inviteUser');
    let mem = document.querySelector('#memberArea'); //멤버 출력(권한,내보내기할수있음)
    let btnAr = document.querySelector('#btnArea');
    let outMemAr = document.querySelector('#outmemArea');
    let members = await memberList(workId);
    let owner;
    members.forEach(mAuth => {
        if (mAuth.auth == 'OWNER') {
            owner = mAuth.email;
        }
    })
    document.querySelector('#ownArea').firstElementChild.value = owner;

    let editBtn = document.createElement('button');
    editBtn.id = 'wsEdit';
    editBtn.textContent = '저장';
    btnAr.firstElementChild.replaceWith(editBtn);

    let targetType = document.querySelector('#wsType');

    if (targetType.value == 'TEAM') {
        tTog.classList.remove('hide');
        //팀 워크스페이스인 경우 설정/멤버 토글.
        type.classList.add('hide');

        let event = new Event("change");
        targetType.addEventListener('change', setTypeChange);
        targetType.dispatchEvent(event);

        //설정일때 보여야 하는거
        document.querySelector('#workEdit').addEventListener('click', setTypeChange);

        document.querySelector('#teamEdit').addEventListener('click', function (e) {
            //멤버일때 보여야 하는거
            if (membAuth == 'OWNER') {
                type.classList.add('hide');
                pub.classList.add('hide');
                del.classList.add('hide');
                name.classList.add('hide');
                own.classList.add('hide');
                inv.classList.remove('hide');
                mem.classList.remove('hide');
                btnAr.classList.add('hide');
                outMemAr.classList.add('hide');
                delCheck.classList.add('hide');

            } else if (membAuth == 'MANAGER') {
                type.classList.add('hide');
                pub.classList.add('hide');
                del.classList.add('hide');
                name.classList.add('hide');
                own.classList.add('hide');
                inv.classList.remove('hide');
                mem.classList.add('hide');
                btnAr.classList.add('hide');
                outMemAr.classList.add('hide');
                delCheck.classList.add('hide');
            }
        })

    } else if (infoResult.workType == 'PERSONAL') {
        //개인일때 보여야 하는거
        targetType.value = infoResult.workType;
        let event = new Event("change");
        targetType.addEventListener('change', setTypeChange);
        targetType.dispatchEvent(event);

        type.classList.add('hide');
        del.classList.remove('hide');
        tTog.classList.add('hide');
        own.classList.add('hide');
        inv.classList.add('hide');
        mem.classList.add('hide');
        pub.classList.remove('hide');
        name.classList.remove('hide');
        btnAr.classList.remove('hide');
        outMemAr.classList.add('hide');
        document.querySelector('#wsName').readOnly = false;
        delCheck.classList.add('hide');
    }

    //저장 버튼 눌렀을 때 수정
    editBtn.addEventListener('click', function (e) {
        editWorkSpace(workId);
    });


    document.querySelector('#deleteBtn').addEventListener('click', areUDelete);

    //멤버 내보내기 버튼 누르면 내보내기 창으로 넘어감.
    document.querySelector("#memberOut").addEventListener("click", function (e) {
        tTog.classList.add("hide");
        inv.classList.add("hide");
        mem.classList.add("hide");
        btnAr.classList.remove("hide");
        outMemAr.classList.remove("hide");
        document
            .querySelectorAll("#outmemList > tr")
            .forEach((item) => item.remove());

        let outBtn = document.createElement("button");
        outBtn.id = "outMem";
        outBtn.textContent = "내보내기";
        btnAr.firstElementChild.replaceWith(outBtn);

        //같은 이름을 가진 체크박스 전체를 가져옴
        let checkbox = document.getElementsByName("member");
        let val = [];
        checkbox.forEach((item) => {
            if (item.checked) {
                if (item.value != "checkAll") {
                    let workId =
                        item.parentElement.closest("tr").children[0].firstElementChild
                        .value;
                    let email = item.parentElement.closest("tr").children[1].textContent;

                    //멤버 내보내기에 새로운 리스트를 만듦
                    let trTag = document.createElement("tr");
                    let tdTag = document.createElement("td");

                    tdTag.textContent = email;
                    trTag.appendChild(tdTag);

                    //제외버튼 생성
                    let td = document.createElement("td");
                    let noBtn = document.createElement("button");
                    noBtn.textContent = "제외";
                    td.appendChild(noBtn);
                    trTag.appendChild(td);
                    document.querySelector("#outmemList").appendChild(trTag);

                    //일단 가져온 멤버 전부 배열에 집어넣음(필터 사용하기 위해)
                    val.push({
                        workId,
                        email,
                    });

                    //제외하기 버튼을 누르면 필터를 통해 내보내지 않을 멤버의 이메일을 빼고 새 배열을 만듦)
                    noBtn.addEventListener("click", function (e) {
                        let targetTd = e.currentTarget.parentElement.previousSibling;
                        val = val.filter((no) => no.email != targetTd.textContent);
                        targetTd.parentElement.remove();
                    });

                    // 내보낼 멤버가 확정됐을때(필터로 걸러짐/배열에 집어넣음) 내보내는 코드
                    outBtn.addEventListener("click", function (e) {
                        memberOut(val);
                    });
                }
            }
        });
    });
}

async function areUDelete(e) {
    let tTog = document.querySelector('#teamToggleArea');
    let pub = document.querySelector('#pubArea'); //공개범위 영역
    let own = document.querySelector('#ownArea'); //소유자 영역
    let del = document.querySelector('#deleteBtn'); //삭제로 넘어가는 버튼
    let delCheck = document.querySelector('#delCheckArea'); //삭제확인
    let workId = document.querySelector('#wid').value;
    let infoResult = await selectOneWork(workId);
    let btnAr = document.querySelector('#btnArea');

    let homePg = document.querySelector('#homePg').value;

    let delBtn = document.createElement('button');
    delBtn.id = 'wsDel';
    delBtn.textContent = '삭제';
    btnAr.firstElementChild.replaceWith(delBtn);

    if (homePg == infoResult.mainPageId) {
        delCheck.classList.add('hide');
        tTog.classList.remove('hide');
        pub.classList.remove('hide');
        del.classList.remove('hide');
        own.classList.remove('hide');
        alert('이 워크스페이스는 삭제할 수 없습니다.')
        closeSideModal();
    } else if (homePg != infoResult.mainPageId) {
        delCheck.classList.remove('hide');
        tTog.classList.add('hide');
        pub.classList.add('hide');
        del.classList.add('hide');
        own.classList.add('hide');
        document.querySelector('#wsName').readOnly = true;

        delBtn.addEventListener('click', function (e) {
            deleteWorkS(workId);
        });
    }
}


async function setTypeChange(e) {
    let workId = document.querySelector('#wid').value;
    let membAuth = await memberCheck(workId);
    let targetType = document.querySelector('#wsType');

    let invite = document.querySelector("#inviteUser"); //초대 부분
    let memberOption = document.querySelector("#memOption"); //멤버공개옵션(팀)
    let privateOption = document.querySelector("#privOption"); //비공개옵션(개인)
    if (targetType.value == "TEAM") {
        memberOption.classList.remove("hide");
        privateOption.classList.add("hide");
    } else {
        invite.classList.add("hide");
        memberOption.classList.add("hide");
        privateOption.classList.remove("hide");
    }

    let name = document.querySelector('#nameArea'); //워.스.이름영역
    let pub = document.querySelector('#pubArea'); //공개범위 영역
    let own = document.querySelector('#ownArea'); //소유자 영역
    let del = document.querySelector('#deleteBtn'); //삭제로 넘어가는 버튼
    let delCheck = document.querySelector('#delCheckArea'); //삭제확인
    let mem = document.querySelector('#memberArea'); //멤버 출력(권한,내보내기할수있음)
    let btnAr = document.querySelector('#btnArea');
    let outMemAr = document.querySelector('#outmemArea');
    let type = document.querySelector('#typeArea'); //타입 영역

    if (membAuth == 'OWNER') {
        type.classList.add('hide');
        del.classList.remove('hide');
        own.classList.remove('hide');
        del.classList.remove('hide');
        pub.classList.remove('hide');
        invite.classList.add('hide');
        mem.classList.add('hide');
        name.classList.remove('hide');
        btnAr.classList.remove('hide');
        outMemAr.classList.add('hide');
        delCheck.classList.add('hide');
        document.querySelector('#wsName').readOnly = false;

    } else if (membAuth == 'MANAGER') {
        del.classList.add('hide');
        own.classList.add('hide');
        del.classList.add('hide');
        pub.classList.remove('hide');
        invite.classList.add('hide');
        mem.classList.add('hide');
        name.classList.remove('hide');
        btnAr.classList.remove('hide');
        outMemAr.classList.add('hide');
        delCheck.classList.add('hide');
        document.querySelector('#wsName').readOnly = true;
        type.classList.add('hide');
    }
}

//체크박스 전체 선택/취소
function selectAll(selectAll) {
    let checkboxes = document.getElementsByName("member");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    });
}

//새 워크스페이스 생성
function newWorkSpace() {

    let workType = document.querySelector('#wsType');
    let publicCheck = document.querySelector('#wsPrivate');
    let email = document.querySelector('#loginUser').value;
    let workName = document.querySelector('#wsName');
    let parentId = document.querySelector('#wid');

    if (parentId) {
        parentId = parentId.value;
    } else {
        parentId = '';
    }

    let val = {
        "parentId": parentId,
        "workType": workType.value,
        "workName": workName.value,
        "publicCheck": publicCheck.value,
        email
    };
    let url = '/workInsert';

    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(val)
        })
        .then(response => response.text())
        .then(result => {
            if (workType.value == 'TEAM') {
                inviteWork(result); //워크스페이스 초대하는 메소드
            }
            closeSideModal();
            workList(email);

        })
        .catch(err => console.log(err));
}

//워크스페이스 타입별 select option 구분 / 초대 부분 노출여부

function typeChange(e) {
    let invite = document.querySelector("#inviteUser"); //초대 부분
    let memberOption = document.querySelector("#memOption"); //멤버공개옵션(팀)
    let privateOption = document.querySelector("#privOption"); //비공개옵션(개인)
    if (e.target.value == "TEAM") {
        invite.classList.remove("hide");
        memberOption.classList.remove("hide");
        privateOption.classList.add("hide");
    } else {
        invite.classList.add("hide");
        memberOption.classList.add("hide");
        privateOption.classList.remove("hide");
    }
}


//엔터 누르면 추가되게...
document.querySelector("#invEmail").addEventListener("keydown", function (e) {
    if (e.keyCode == 13) {
        addList();
    }
});

let invBtn = document.querySelector("#inviteBtn");

//추가 버튼 누르면 밑에 테이블 아래에 목록 추가됨
invBtn.addEventListener("click", addList);

//자동완성기능~~~
async function autoCheckList() {
    let workId = document.querySelector('#wid');

    let memL = [];
    let member = await memberList(workId.value);
    let mail = document.querySelector('#invEmail');

    member.forEach(mem => {
        memL.push(mem.email);
    })

    function findMatches(wordToMatch, memL) {
        return memL.filter(mem => {
            let regex = new RegExp(wordToMatch, 'gi');
            return mem.match(regex);
        });
    }

    document.querySelector('#invEmail').addEventListener('input', displayInputValue);

    function displayInputValue() {
        let matchedArray = findMatches(mail.value, memL);
        let memberSelectList = document.createElement('select');
        let memberOptionList = document.createElement('option');

        memberOptionList.textContent = matchedArray;
        memberSelectList.appendChild(memberOptionList);
        mail.appendChild(memberSelectList);
    }
}

async function addList() {
    let workId = document.querySelector('#wid');
    let mail = document.querySelector('#invEmail');
    let invList = document.querySelector('#invList');
    //이메일 정규식
    let areUMail = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    let mine = document.querySelector("#side input.logUser");

    if (mail.value != '' && areUMail.test(mail.value) && mine.value != mail.value) {

        //wid부분이 비어있는 경우(새 워크스페이스를 생성하는 경우)
        if (!workId || workId.value == '') {

            let trTag = document.createElement('tr');
            let tdTag = document.createElement('td');
            tdTag.textContent = mail.value;

            trTag.appendChild(tdTag);
            invList.appendChild(trTag);

            mail.value = '';
            mail.focus();

            //wid부분이 비어있지 않은 경우(하위 워크스페이스 생성이거나, 설정에서 멤버를 수정하는 경우.)
        } else if (workId.value != '') {
            let member = await memberList(workId.value);
            let invite = await listWorkJoin(workId.value);
            let thisM = false;
            let thisI = false;
            let tdList = document.querySelectorAll('#invList > tr > td');

            member.forEach(mem => {
                if (mem.email == mail.value) {
                    thisM = true;
                } else {
                    thisM = false;
                }
            })
            tdList.forEach(tL => {
                if (tL.textContent == mail.value) {
                    thisI = true;
                } else {
                    thisI = false;
                }
            })
            //하위워크스페이스 여부가 true이면
            if (subCheck == true) {
                if (thisM == false && thisI == true && invite.includes(mail.value) == true) {
                    alert('하위 워크스페이스에는 상위 워크스페이스의 멤버만 초대할 수 있습니다.')

                } else if (thisM == true && thisI == false) {
                    let trTag = document.createElement('tr');
                    let tdTag = document.createElement('td');
                    tdTag.textContent = mail.value;

                    trTag.appendChild(tdTag);
                    invList.appendChild(trTag);

                    mail.value = '';
                    mail.focus();
                }

                //하위 워크스페이스가 아니고 설정에서 사용자를 새로 초대하는 경우
            } else if (subCheck == false) {

                if (thisM == false && thisI == false && invite.includes(mail.value) == false) {
                    inviteWork(workId.value);
                    mail.value = '';
                    mail.focus();
                    listWorkJoin(workId.value);
                } else {
                    alert('이 사용자는 초대할 수 없습니다.');
                }
            }
        }

    } else if (mine.value == mail.value) {
        alert('자기 자신은 초대할 수 없습니다.');
    } else {
        alert('올바른 이메일을 입력해 주십시오.');
        mail.focus();
    }


};

//워크스페이스 초대
function inviteWork(workId) {
    let inviteList = []; //workJoin에 workId랑 초대 이메일 담아서 json으로 넘기는 배열
    let creUser = document.querySelector('#loginUser').value;
    let tdList = document.querySelectorAll('#invList > tr > td');
    if (tdList.length > 0) {
        tdList.forEach((item) => {
            let inviteEmail = item.textContent;
            inviteList.push({
                workId,
                inviteEmail,
                creUser
            })
        })
    } else if (tdList.length == 0) {
        let inviteEmail = document.querySelector('#invEmail').value;
        inviteList.push({
            workId,
            inviteEmail
        })
    }
    console.log(inviteList);
    let url = '/workJoin';
    
    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inviteList)
    })
    .then(response => response.text())
    .then(result => {
        console.log(result + '건 성공');
        tdList.forEach(item => {
            item.remove();
        })
    })
    .catch(err => console.log(err));

}

const arr = ["workId", "email", "auth"];

//멤버 조회
async function memberList(workId) {
    let authAry = [{
        val: 'MANAGER',
        text: '관리자'
    }, {
        val: 'NOMAL',
        text: '일반'
    }];
    let url = `/memberList?workId=${workId}`;
    let mail = [];

    await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            document.querySelector('#memList').replaceChildren();
            for (let num of result) {
                mail.push({
                    workId,
                    email: num.email,
                    auth: num.auth
                });

                if (num.auth != 'OWNER') {
                    let trTag = document.createElement('tr');

                    for (let field of arr) {
                        if (field == 'workId') {
                            let tdTag = document.createElement('td');
                            let inputTag = document.createElement('input');
                            inputTag.type = 'hidden';
                            inputTag.value = num[field];
                            tdTag.appendChild(inputTag);
                            trTag.appendChild(tdTag);
                        } else {
                            let tdTag = document.createElement('td');
                            tdTag.textContent = num[field];
                            trTag.appendChild(tdTag);
                        }
                    }
                    //삭제 체크박스
                    let tdTag = document.createElement('td');
                    let check = document.createElement('input');
                    check.name = 'member';

                    //권한 select 생성
                    let td = document.createElement('td');
                    let authSelect = document.createElement('select');
                    authSelect.id = 'memberAuth';

                    //권한 option 생성
                    for (let option of authAry) {
                        let memOp = document.createElement('option');
                        memOp.value = option.val;
                        memOp.textContent = option.text;
                        authSelect.appendChild(memOp);
                    }
                    authSelect.value = num.auth;

                    authSelect.addEventListener('change', function (e) {
                        let changeAuth = e.currentTarget.value;
                        let targetMail = e.currentTarget.closest('tr').children[1].textContent;
                        let val = [];
                        val.push({
                            workId,
                            "email": targetMail,
                            "auth": changeAuth
                        });
                        renewMemberAuth(val);
                    })

                    check.type = 'checkbox';
                    tdTag.appendChild(check);
                    td.appendChild(authSelect);

                    trTag.appendChild(tdTag);
                    trTag.appendChild(td);

                    document.querySelector('#memList').append(trTag);
                }
            }
        })
        .catch(err => console.log(err));
    return mail;
}

//워크스페이스 설정에 쓸 단건조회
async function selectOneWork(workId) {
    let selectResult = '';

    let url = `/workInfo?workId=${workId}`;
    await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            for (let field in result) {
                if (field == 'workName' && !subCheck) {
                    let WNInput = document.querySelector(`[name="${field}"]`);
                    WNInput.value = result[field];
                }
                for (let nm of wNameList) {
                    if (field == nm) {
                        let list = document.querySelector(`[name="${field}"]`);
                        list.value = result[field];
                    }
                }
            }
            selectResult = result;
        })
        .catch(err => console.log(err));
    return selectResult;
}

//워크스페이스 삭제(체크)
function deleteWorkS(workId) {
    let workNm = document.querySelector('#wsName');
    let nameCheck = document.querySelector('#delCheck');
    let email = document.querySelector('#loginUser').value;
    let val = {
        workId,
        email
    }

    if (nameCheck.value == workNm.value) {

        let url = `/workDelete`;
        fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(val)
            })
            .then(response => response.text())
            .then(result => {
                alert('워크스페이스가 삭제되었습니다.');

                closeSideModal();
                workList(email);
            })
            .catch(err => console.log(err));

    } else {
        alert('워크스페이스명이 일치하지 않습니다. 확인 후 다시 시도해주세요.');
    }

}

//워크스페이스 수정
function editWorkSpace(workId) {
    let publicCheck = document.querySelector('#wsPrivate');
    let workName = document.querySelector('#wsName');
    let email = document.querySelector('#loginUser').value;

    let val = {
        workId,
        "workName": workName.value,
        "publicCheck": publicCheck.value,
        email
    };
    let url = '/workEdit';

    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(val)
        })
        .then(response => response.text())
        .then(result => {
            alert('워크스페이스가 수정되었습니다.')

            closeSideModal();
            workList(email);
        })
        .catch(err => console.log(err));
}

//멤버 제외
function memberOut(list) {

    let url = '/memberDelete';

    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(list)
        })
        .then(response => response.json())
        .then(result => {
            closeSideModal();
        })
        .catch(err => console.log(err))

}

//멤버 권한 재설정
function renewMemberAuth(list) {

    let url = '/memberRenewAuth';
    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(list)
        })
        .then(response => response.text())
        .then(result => {
            if (result == list.length) {
                alert('권한이 변경되었습니다.')
            } else {
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            }
        })
        .catch(err => console.log(err));

}

//팀 워크스페이스 소유자 부분 수정시 소유자 변경
document.querySelector('#ownArea').firstElementChild.addEventListener('change', changeOwner);

async function changeOwner(e) {
    let workId = document.querySelector('#wid').value;
    let checkManager = await memberList(workId);
    let email = document.querySelector('#ownArea').firstElementChild;
    let check = false;
    let owner = '';
    checkManager.forEach(own => {
        if (own.auth == 'OWNER') {
            owner = own.email;
        };
    })
    for (id of checkManager) {
        if (email.value != '') {
            if (id.auth == 'MANAGER' && id.email == email.value) {
                check = true;
                break;
            } else {
                alert('소유자 권한은 관리자에게만 이전 가능합니다.');
                check = false;
                email.value = owner;
                break;
            }
        } else {
            alert('올바른 이메일을 입력해주십시오.');
            email.value = owner;
        }
    }
    let val = [];

    if (check == true) {
        val.push({
            workId,
            "email": email.value,
            "auth": "OWNER"
        });

        let changemail = document.querySelector('#loginUser');
        if (changemail.value != email.value) {
            val.push({
                workId,
                "email": changemail.value,
                "auth": "MANAGER"
            });
        }
        renewMemberAuth(val);
    }
}



//워크스페이스 초대 리스트 불러옴..뒤에 초대중 붙음
async function listWorkJoin(workId) {

    let url = `/joinList?workId=${workId}`;
    let mailList = [];
    await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            if (document.querySelector('#beforeJoin')) {
                document.querySelector('#beforeJoin').remove();
            }
            let invList = document.querySelector('#invList');
            let beforeJoin = document.createElement('table');
            beforeJoin.id = 'beforeJoin';
            for (let inv of result) {
                mailList.push(inv.inviteEmail);
                let trTag = document.createElement('tr');
                let tdTag = document.createElement('td');

                tdTag.textContent = inv.inviteEmail;

                let also = document.createElement('td');
                also.textContent = '초대중...';

                trTag.appendChild(tdTag);
                trTag.appendChild(also);
                beforeJoin.appendChild(trTag);
            }

            invList.before(beforeJoin);

        })
        .catch(err => console.log(err));
    return mailList;
}