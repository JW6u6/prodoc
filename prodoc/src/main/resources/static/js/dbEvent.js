// 그룹이벤트
document.getElementById("pagecontainer").addEventListener("click", e =>{    // 클릭 이벤트
    if (e.target.matches(".database-search")) databaseSearch(e);
    else if (e.target.matches(".add-dbpage")) insertDBpage(e);
    else if (e.target.matches(".change-layout")) layoutClick(e);
    else if (e.target.matches(".page-attr-option")) pageAttrOption(e);
    else if (e.target.matches(".attr-view-selector")) attrViewChange(e);
    else if (e.target.matches(".add-page-attr")) addPageAttr(e);
    else if (e.target.matches(".page-attr-list")) selectAttr(e);
    else if (e.target.matches(".insert-page-attr")) registAttr(e);
    else if (e.target.matches(".del-attr")) deleteAttr(e);
    else if (e.target.matches(".del-db-page")) deleteDBpage(e);


    // 속성 이벤트
    else if (e.target.matches(".attr-case")) updateContent(e);
    else if (e.target.matches(".dbattr-check")) attrCheck(e);
    else if (e.target.matches(".delete-attr")) deleteThisAttr(e);
    else if (e.target.matches(".file-content")) selectFileAttr(e);
    else if (e.target.matches(".attr-name")) modifyAttrName(e);

    // 모달
    else if (e.target.matches(".close-attr-modal")) closeAttrModal(e);
})
document.getElementById("pagecontainer").addEventListener("keydown", e => { // 키보드 이벤트
    if (e.target.matches(".attr")) attrContentUpdate(e);
    else if (e.target.matches(".attr-name")) modifyAttrName(e);
})
document.getElementById("pagecontainer").addEventListener("change", e => { // 체인지 이벤트
    if (e.target.matches(".db-img-upload")) addAttrImage(e);
    else if (e.target.matches(".db-file-upload")) addAttrFile(e);

})


function closeAttrModal(e){
    let modal = e.target.parentElement;
    modal.parentElement.classList.remove("modal-top");
    modal.remove();
}

// 레이아웃 변경을 위한 정보 전달 => 레이아웃 변경 이벤트 실행
function layoutClick(e){
    let layout = e.target.closest('[data-dblayout]').getAttribute("data-dblayout");     // 선택된 레이아웃 (update)
    let pageId = e.target.closest('[data-page-id]').getAttribute("data-page-id");       // 선택된 case의 페이지 id (update)
    let caseId = e.target.closest('[data-block-id]').getAttribute("data-block-id");     // 선택된 case의 블럭 id (하위블럭 정보 select)
    console.log("레이아웃 클릭 : " + layout, pageId, caseId);
    
    updateCase(pageId, layout);     // case_id 업데이트 fetch
}

// DBcase block 생성
function createDBblock(block){
    const dbBlockTemp = `
    <div class="db-block" data-block-id="` + block.displayId + `" data-block-order="`+ block.rowX +`">
        <div data-attr-option="`+block.displayId+`" class='hide'></div>
        <div class="db-block-header">
            <div>` + block.content + `</div>
            <div class="db-layout-list">
                <ul>
                    <li class="change-layout" data-dblayout="DB_LIST">리스트</li>
                    <li class="change-layout" data-dblayout="DB_BRD">칸반보드</li>
                    <li class="change-layout" data-dblayout="DB_GAL">갤러리</li>
                    <li class="change-layout" data-dblayout="DB_TBL">표</li>
                </ul>
            </div>
                <div class="db-attr-option">
                    <button class="page-attr-option">속성</button>
                </div>
        </div>
        <div class="db-block-body"></div>

        <div data-attr-modal="`+block.displayId+`" class='hide'></div>
    </div>
    `;
    return dbBlockTemp;
}

// 하위 페이지 불러오기 | 매개값 : case block의 DisplayId
async function getChildList(disId){
    let caseInfo = [];
	let url = 'getChildList?parentId=' + disId;
	await fetch(url, {
		method : 'get'
	})
	.then( response => response.json())
	.then( infoList => {     // infoList : { 'parent' : {casePageVO}, '하위블럭id' : { {'block' : VO}, {'page' : VO}, {'attrList' : []} } }
        for(let key in infoList){
            if(key == "parent") {
                let parentDiv = document.querySelectorAll('[data-block-id]');                
                parentDiv.forEach(tag => {
                    let tagId = tag.getAttribute("data-block-id");
                    if(tagId == disId){
                        tag.setAttribute("data-page-id", infoList[key]["pageId"]);
                        tag.setAttribute("data-layout", infoList[key]["caseId"]);
                    }
                });
            } else {
                caseInfo.push(infoList[key]);
            }
            
        }
        console.log(caseInfo);
        listLayoutEditor(caseInfo, infoList['parent']['pageId'], infoList['parent']['caseId']);
	})
	.catch(err => console.log(err));
}

// 검색 이벤트
function databaseSearch(e){
    let pageId = e.target.closest('[data-page-id]').getAttribute("data-page-id");   // db case page의 아이디
/*
    fetch("",{

    })
    .then(response => response.json())
    .then(result =>{
        console.log(result);
    })
    .catch(err => console.log(err));
*/
}

// DB 하위 페이지 생성
function insertDBpage(e){
    let caseBlock = e.target.closest('[data-layout]');
    let pageInfo = {};  // 하위페이지 만들 정보

    let nowLayout = caseBlock.getAttribute("data-layout");
    pageInfo['parentBlockId'] = caseBlock.getAttribute("data-block-id");    // db case page의 아이디
    pageInfo['displayId'] = window.crypto.randomUUID();                     // 랜덤 아이디 생성

    if(nowLayout == 'DB_BRD'){
        let nowState = e.target.closest('[data-state]').getAttribute("data-state"); //생성위치의 상태값
        console.log(nowState);
        pageInfo['state'] = nowState;
    } else pageInfo['state'] = "";
    
    fetch("insertDBpage", {
        method : 'post',
        body : JSON.stringify(pageInfo),
        headers : {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        let caseBody = caseBlock.querySelector('.db-block-body');
        let targetNode = e.target.closest('.add-page-div');
        let block;
        if(result != null && nowLayout != "DB_CAL"){
            if(nowLayout == "DB_LIST"){
                block = dblistBlock(result);
            } else if(nowLayout == "DB_BRD"){
                block = dbBrdBlock(result);
            } else if(nowLayout == "DB_GAL"){
                block = dbGalBlock(result);
            } else if(nowLayout == "DB_TBL"){
                block = dbTblBlock(result);
            }
            targetNode.insertAdjacentHTML("beforebegin", block);

            if(nowLayout == "DB_LIST"){     // 리스트 형식일때 속성에 클래스 추가용
                let selector = `[data-page-id="${result.page.pageId}"] .attr-list [data-attrid]`;
                caseBody.querySelectorAll(selector).forEach(tag => {
                    tag.classList.add("inlineTags");
                })
            }
        } else if(result != null && nowLayout == "DB_CAL"){
            // 캘린더에서 추가
            let thisDate = e.target.parentElement.getAttribute("data-cal-date");
            fetch("addCalendar", {
                method : 'post',
                body : JSON.stringify({'pageId' : result.page.pageId, 'attrContent' : thisDate}),
                headers : {"Content-Type": "application/json"}
            })
            .then(response => response.json())
            .then(data => {
                if(data.result == "success"){
                    console.log(result);
                    let addTarget = e.target.closest('.cal-row');
                    // cal data div 생성 > append
                }
            })
        }
    })
    .catch(err => console.log(err));
}

// DB 하위 페이지 삭제
function deleteDBpage(e){
    let data = {};
    let delPageDiv = e.target.closest("[data-page-id]");
    let caseId =  e.target.closest("[data-layout]").getAttribute('data-block-id');
    data['pageId'] = e.target.closest("[data-page-id]").getAttribute("data-page-id");
    data['displayId'] = e.target.closest("[data-block-id]").getAttribute('data-block-id');
    data['creUser'] = 'user1@user1' //⭐⭐
    // data['creUser'] = document.getElementById("UserInfoMod").querySelector(".email").textContent;
    data['workId'] = 'TESTWORK'     //⭐⭐워크id 가져오기
    console.log(data);
    fetch("deleteDBPage", {
        method : 'post',
        body : JSON.stringify(data),
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.json())
    .then(result => {
        if(result.result == 'success') delPageDiv.remove();
    })
    .catch(err => console.log(err));
}