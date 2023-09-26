// 그룹이벤트
document.getElementById("pagecontainer").addEventListener("click", e =>{
    if (e.target.matches(".database-search")) databaseSearch(e);
    else if (e.target.matches(".add-dbpage")) insertDBpage(e);
    else if (e.target.matches(".change-layout")) layoutClick(e);
    else if (e.target.matches(".page-attr-option")) pageAttrOption(e);
    else if (e.target.matches(".attr-view-selector")) attrViewChange(e);
    else if (e.target.matches(".add-page-attr")) addPageAttr(e);
    else if (e.target.matches(".page-attr-list")) selectAttr(e);
    else if (e.target.matches(".insert-page-attr")) registAttr(e);
})

// 레이아웃 변경을 위한 정보 전달 => 레이아웃 변경 이벤트 실행
function layoutClick(e){
    let layout = e.target.closest('[data-dblayout]').getAttribute("data-dblayout");     // 선택된 레이아웃 (update)
    let pageId = e.target.closest('[data-page-id]').getAttribute("data-page-id");       // 선택된 case의 페이지 id (update)
    let caseId = e.target.closest('[data-block-id]').getAttribute("data-block-id");     // 선택된 case의 블럭 id (하위블럭 정보 select)
    console.log(layout, pageId, caseId);
    
    updateCase(pageId, layout);     // case_id 업데이트 fetch
    console.log(caseId);
    getChildList(caseId);
}

// DBcase block 생성
function createDBblock(block){
    const dbBlockTemp = `
    <div class="db-block" data-block-id="` + block.displayId + `" data-block-order="`+ block.rowX +`">
        <div class="db-block-header">
            <div contenteditable="true">` + block.content + `</div>
            <div class="db-layout-list">
                <ul>
                    <li class="change-layout" data-dblayout="DB_LIST">리스트</li>
                    <li class="change-layout" data-dblayout="DB_BRD">칸반보드</li>
                    <li class="change-layout" data-dblayout="DB_GAL">갤러리</li>
                    <li class="change-layout" data-dblayout="DB_TBL">표</li>
                    <li class="change-layout" data-dblayout="DB_CAL">캘린더</li>
                </ul>
            </div>
            <div class="db-search-option">
                <div class="select-date-btn">날짜</div>
                <select>
                    <option disabled selected>검색옵션</option>
                    <option value="STATE">상태</option>
                    <option value="TAG">태그</option>
                    <option value="page_name">페이지명</option>
                    <option value="CUSER">생성자</option>
                </select>
                <input type="text" name="keyword" placeholder="검색어">
                <button class="database-search">검색</button>
                <div id="selectDate" visibility="hidden" style="display: none;">
                    <input type="radio" name="date" value="period" checked>기간
                    <input type="radio" name="date" value="creDate">등록일
                    <input type="radio" name="date" value="upDate">최종수정일
                    <br>
                    <input type="date" name="startDate"> ~ <input type="date" name="endDate" disabled> 
                </div> 
            </div>
            <div class="db-attr-option">
                <button class="page-attr-option">속성</button>
            </div>
        </div>
        <div class="db-block-body"></div>


        <div data-attr-option="`+block.displayId+`" class='hide'></div>
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
	.then(response => response.json())
	.then(infoList => {     // infoList : { 'parent' : {casePageVO}, '하위블럭id' : { {'block' : VO}, {'page' : VO}, {'attrList' : []} } }
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
        listLayoutEditor(caseInfo, infoList['parent']['pageId'], infoList['parent']['caseId']);
	})
	.catch(err => console.log(err))
    return caseInfo;
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

// page Info (function앞에 async, fetch앞에 await 지움)
async function getPageInfo(pageid){
    let pageInfo = {};
    let url = '/pageInfo?pageId=' + pageid;
    await fetch(url)
    .then(response => response.json())
    .then(result => {
        pageInfo = result;
    })
    .catch(err => console.log(err));
    return pageInfo;
}

// DB페이지 생성
function insertDBpage(e){
    let caseBlock = e.target.closest('[data-layout]');
    let pageInfo = {};  //하위페이지 만들 정보

    let nowLayout = caseBlock.getAttribute("data-layout");
    pageInfo['parentBlockId'] = caseBlock.getAttribute("data-block-id");    // db case page의 아이디
    pageInfo['displayId'] = window.crypto.randomUUID();                     // 랜덤 아이디 생성

    if(nowLayout == 'DB_BRD'){
        let nowState = e.target.closest('[data-state]').getAttribute("data-state"); //생성위치의 상태값
        console.log(nowState);
        pageInfo['state'] = nowState;
    } else pageInfo['state'] = "";
    

    // url 경로 : insertDBpage, post
    fetch("insertDBpage", {
        method : 'post',
        body : JSON.stringify(pageInfo),
        headers : {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        let pBlockId = result.result;
        if (pBlockId != 'fail') getChildList(pBlockId);
    })

}

// 페이지 속성 보이기
function pageAttrOption(e){
    let caseBkId = e.target.closest('[data-block-id]').getAttribute("data-block-id");
    let display = document.querySelector('[data-attr-option="'+caseBkId+'"]');
    if(display.getAttribute("class") == 'hide') display.setAttribute("class", 'view');
    else display.setAttribute("class", 'hide');
    getAllPageAttr(caseBkId);
}

// 하위 페이지의 모든 속성 불러오기
// 패치 따로 만들기 => list 반환, list로 태그 생성
function getAllPageAttr(caseBlockId){
    let div = document.querySelector('[data-attr-option="'+caseBlockId+'"]');
    div.innerHTML = "";
    let url = 'getAllPageAttr?parentId=' + caseBlockId;
    fetch(url, {
        method : 'get'
    })
    .then(response => response.json())
    .then(attrList => {
        let attrDiv = `<div class="hide">사용속성목록</div>`
        attrList.forEach(attr => {
            let view = '⚪';
            if(attr.displayCheck == 'FALSE') view ='⚫';
            attrDiv += `
                <div data-dbuseid=`+attr.dbUseId+`>
                    <div class="attr-view-selector inlineTags">`+view+`</div>
                    <div class="inlineTags" data-attr-id="`+attr.attrId+`" data-attr-view="`+attr.displayCheck+`">`+attr.attrName+`</div>
                </div>
            `;
        })
        attrDiv += `<button class="add-page-attr">속성추가</button>`;
        div.insertAdjacentHTML("afterbegin", attrDiv);

    })
    .catch(err => console.log(err))
}

// ✅수정중
function useAttrList(caseBlockId){
    let url = 'getAllPageAttr?parentId=' + caseBlockId;
    let list = [];
    fetch(url, {
        method : 'get'
    })
    .then(response => response.json())
    .then(attrList => {
        list = attrList;
    })
    .catch(err => console.log(err))
    return list;
}

// 속성 보기 옵션
function attrViewChange(e){
    let caseId =  e.target.closest('[data-block-id]').getAttribute("data-block-id");
    console.log(caseId);
    let dbUseId = e.target.closest('[data-dbuseid]').getAttribute("data-dbuseid");
    let viewOp = e.target.nextElementSibling.getAttribute("data-attr-view");
    if(viewOp == 'TRUE') viewOp = 'FALSE';
    else if (viewOp == 'FALSE') viewOp = 'TRUE';
    console.log(viewOp);
    fetch('displayAttrChange', {
        method : 'post',
        body : JSON.stringify({'dbUseId' : dbUseId, 'displayCheck' : viewOp}),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(result => {
        if(result.result == "success") getChildList(caseId);
    })
    .catch(err => console.log(err));

    getAllPageAttr(caseId);
}

function addPageAttr(e){
    let div = e.target.closest('[data-attr-option]');
    console.log(div);
    div.innerHTML = "";
    let addTag = `<div>타입선택</div>`;
    fetch("pageAttrList")
    .then(response => response.json())
    .then(attrList => {
        attrList.forEach(attr => {
            // ✔아이콘 추가하기
            addTag += `
            <div class="page-attr-list" data-attr-id="`+attr.attrId+`">`+attr.attrType+`</div>
            `
        })
        addTag += `
        <input type="text" name="useAttrName" placeholder="타입명">
        <input type="text" name="useAttrId" style="display:none;">
        <button class="insert-page-attr">추가</button>
        <button class="page-attr-option">취소</button>
        `
        div.insertAdjacentHTML("afterbegin", addTag);
    })
    .catch(err => console.log(err))

}

// 속성추가 전 선택한 속성값
function selectAttr(e){
    let attrId = e.target.getAttribute("data-attr-id");
    let attrName = e.target.textContent;
    e.target.parentElement.querySelector('[name="useAttrId"]').value = attrId;
    e.target.parentElement.querySelector('[name="useAttrName"]').value = attrName;
}

// 사용자가 속성 추가
function registAttr(e){
    let attrInfo = {};
    attrInfo['attrId'] = e.target.parentElement.querySelector('[name="useAttrId"]').value;
    attrInfo['attrName'] = e.target.parentElement.querySelector('[name="useAttrName"]').value;
    attrInfo['caseBlockId'] = e.target.closest('[data-attr-option]').getAttribute("data-attr-option");
    
    fetch("insertDbAttr", {
        method : 'post',
        body : JSON.stringify(attrInfo),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
}