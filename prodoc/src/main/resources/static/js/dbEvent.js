//DOM 변화 감지
const observer = new MutationObserver(mutations => {
    //검색 버튼이벤트 활성화
    const dbSearch = document.querySelectorAll(".database-search");
    dbSearch.forEach(ele => {
        ele.addEventListener("click", databaseSearch);
    })

    // DB 레이아웃 체인지 이벤트
    document.querySelectorAll(".change-layout").forEach(tag => {
        tag.addEventListener("click", function(e){
            let layout = e.currentTarget.getAttribute("data-dblayout");
            let pageId = e.currentTarget.closest('[data-page-id]').getAttribute("data-page-id");

            listLayoutChange(pageId, layout);
        });
    });
    
})  //observer
const obOption = {
    attributes: true,
    childList: true,
    characterData: true
};
observer.observe(container,obOption);

const pageList = [];     // 하위 블럭 리스트

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
    console.log(e.target);
}


// DB케이스의 하위 페이지 불러오기
function getDBPageList(blockId){
    pageList.length = 0;
    fetch("getDBPageList",{
        method : "post",
        body : blockId
    })
    .then(response => {
        return response.json();
    })
    .then(async(result) => {
        console.log(result);
        let casePageId = result[0].pageId;
        let pageInfo = await getPageInfo(casePageId);
        result.forEach(item => {
            pageList.push(item);
        });
        let select = `[data-block-id="`+ result[0].parentId +`"]`;
        let selTag = document.querySelector(select);
        selTag.setAttribute('data-page-id', pageInfo.pageId);
        listLayoutChange(pageInfo.pageId, pageInfo.caseId);
    })
    .catch(err => console.log(err))
}

// page Info
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