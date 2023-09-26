// 그룹이벤트
document.getElementById("pagecontainer").addEventListener("click", e =>{
    if (e.target.matches(".database-search")) databaseSearch(e);
    else if (e.target.matches(".add-dbpage")) insertDBpage(e);
    else if (e.target.matches(".change-layout")) layoutClick(e);
    else if (e.target.matches(".page-attr-option")) pageAttrOption(e);
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
    <div class="db-block" data-block-id="` + block.displayId + `">
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
    </div>
    `;
    return dbBlockTemp;
}

// 하위 페이지 불러오기 | 매개값 : case block의 DisplayId
async function getChildList(disId){
    let pageList = [];
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
            // 하위페이지 리스트
            pageList.push(infoList[key]);   // blockVO, pageVO, attrList
            }
        }
        listLayoutEditor(pageList, infoList['parent']['pageId'], infoList['parent']['caseId']);
	})
	.catch(err => console.log(err))
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
    let nowLayout = e.target.closest('[data-layout]').getAttribute("data-layout");
    console.log(nowLayout);     // 현재 case-id 정보 => 속성 insert or update 필요

    let pageInfo = {};  //하위페이지 만들 정보
    pageInfo['parentPage'] = e.target.closest('[data-page-id]').getAttribute("data-page-id");   // db case page의 아이디
    pageInfo['displayId'] = window.crypto.randomUUID();  // 랜덤 아이디 생성

    if(nowLayout == 'DB_BRD'){
        let nowState = e.target.closest('[data-state]').getAttribute("data-state"); //생성위치의 상태값
        console.log(nowState);
    }

    /*
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
        console.log(result);
        if (result != 'fail') getDBPageList(result);
        
    })
    */
}

// 페이지 속성 보이기
function pageAttrOption(e){
    console.log("case페이지마다 속성 불러오는 div 생성해야함");
    console.log(e.target.closest('[data-block-id]').getAttribute("data-block-id"));
    let caseBkId = e.target.closest('[data-block-id]').getAttribute("data-block-id");
    // getAllpageAttr 사용해서 해당 속성 불러오기
}

// 하위 페이지의 모든 속성 불러오기
function getAllPageAttr(caseBlockId){
    let url = 'getAllPageAttr?parentId=' + caseBlockId;
    fetch(url, {
        method : 'get'
    })
    .then(response => response.json())
    .then(attrList => {
        let attrOptionTag = `<div data-dbdiv="`+caseBlockId+`">`;
        attrList.forEach(attr => {
            attrOptionTag += `
            <div data-page-attr="`+attr.attrId+`">
                <span>`+attr.attrName+`</span>
            </div>
            `
        });
        attrOptionTag += `</div>`;

    })
    .catch(err => console.log(err))
}