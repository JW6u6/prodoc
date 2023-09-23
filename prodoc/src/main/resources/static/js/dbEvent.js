// 그룹이벤트
document.getElementById("pagecontainer").addEventListener("click", e =>{
    if (e.target.matches(".database-search")) databaseSearch(e);
    else if (e.target.matches(".addDBPage")) insertDBpage(e);
    else if (e.target.matches(".change-layout")) layoutClick(e);
})

// 레이아웃 변경을 위한 정보 전달 => 레이아웃 변경 이벤트 실행
function layoutClick(e){
    let layout = e.target.closest('[data-dblayout]').getAttribute("data-dblayout");     // 선택된 레이아웃 (update)
    let pageId = e.target.closest('[data-page-id]').getAttribute("data-page-id");       // 선택된 case의 페이지 id (update)
    let caseId = e.target.closest('[data-block-id]').getAttribute("data-block-id");     // 선택된 case의 블럭 id (하위블럭 정보 select)
    console.log(layout, pageId, caseId);

    let list = getDBPageList(caseId);
    
    updateCase(pageId, layout);     // case_id 업데이트 fetch
    listLayoutEditor(list[1], list[0]['casePageId'], list[0]['caseId']);
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
                    <option>검색옵션</option>
                    <option>상태</option>
                    <option>태그</option>
                    <option>페이지명</option>
                    <option>생성자</option>
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
        </div>
        <div class="db-block-body"></div>
    </div>
    `;
    return dbBlockTemp;
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


// DB케이스의 하위 페이지 불러오기 : caseBlock의 아이디 => 하위 블럭 return
async function getDBPageList(blockId){  //blockId : DBcase block_Id (type : db)
	let pageList = [];     // 하위 블럭 리스트
    let caseInfo = {};
    pageList.length = 0;
    fetch("getDBPageList",{
        method : "post",
        body : blockId
    })
    .then(response => {
        return response.json();
    })
    .then( async(result) => {
        //✔result : [ {BlockVO}, {BlockVO}, {BlockVO} ]
        let casePageId = result[0].pageId;              // case page id
        let pageInfo = await getPageInfo(casePageId);   // case id
        result.forEach(item => {
            pageList.push(item);
        });
        let select = `[data-block-id="`+ result[0].parentId +`"]`;
        let selTag = document.querySelector(select);
        selTag.setAttribute('data-page-id', result[0].pageId);
        console.log(pageList);
        listLayoutEditor(pageList, pageInfo.pageId, pageInfo.caseId);
    })
    .catch(err => console.log(err))

    let dataList = [caseInfo, pageList];  // dataList[0] : case정보, dataList[1] : 블럭리스트
    return dataList;
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
    let pageInfo = {};  //하위페이지 만들 정보
    pageInfo['parentPage'] = e.target.closest('[data-page-id]').getAttribute("data-page-id");   // db case page의 아이디
    pageInfo['displayId'] = window.crypto.randomUUID();  // 랜덤 아이디 생성
    console.log("case page id = " + pageInfo['parentPage']);
    console.log("random id = " + pageInfo['displayId']);

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
        
    })
}