// 그룹이벤트
document.querySelector(".container").addEventListener("click", e =>{    // 클릭 이벤트
    if (e.target.matches(".add-dbpage")) insertDBpage(e);
    else if (e.target.matches(".change-layout")) layoutClick(e);
    else if (e.target.matches(".page-attr-option")) pageAttrOption(e);
    else if (e.target.matches(".attr-view-selector")) attrViewChange(e);
    else if (e.target.matches(".add-page-attr")) addPageAttr(e);
    else if (e.target.matches(".page-attr-list")) selectAttr(e);
    else if (e.target.matches(".insert-page-attr")) registAttr(e);
    else if (e.target.matches(".del-attr")) deleteAttr(e);
    else if (e.target.matches(".del-db-page")) deleteDBpage(e);
    else if (e.target.matches(".data_page")) getDatapageId(e);  // 데이터베이스에서 하위 페이지 클릭

    // 속성 이벤트
    else if (e.target.matches(".attr-case")) updateContent(e);
    else if (e.target.matches(".dbattr-check")) attrCheck(e);
    else if (e.target.matches(".delete-attr")) deleteThisAttr(e);
    else if (e.target.matches(".file-content")) selectFileAttr(e);
    else if (e.target.matches(".attr-name")) modifyAttrName(e);

    // 모달
    else if (e.target.matches(".close-attr-modal")) closeAttrModal(e);
})

// db블럭 클릭 제외 모든 이벤트
function databaseAllEvent(){
    const dbblock = document.querySelectorAll(".database_case");

    dbblock.forEach(block => {
        // 키다운 이벤트
        block.addEventListener("keydown", e => {
            if (e.target.matches(".attr")) attrContentUpdate(e);
            else if (e.target.matches(".attr-name")) modAttrNameFix(e);
            else if (e.target.matches(".db-page-name")) editDBPageName(e);  // DB 이름 변경
        });

        // 체인지 이벤트
        block.addEventListener("change", e => {
            if (e.target.matches(".db-img-upload")) addAttrImage(e);
            else if (e.target.matches(".db-file-upload")) addAttrFile(e);
        })

        // 더블클릭
        block.addEventListener("dblclick", e => {
            if (e.target.matches(".db-page-name")) editDBPageName(e);  // DB 이름 변경
        })
    });

    const dataPage = document.querySelectorAll(".db_attrList");
    dataPage.forEach(page => {
                // 키다운 이벤트
        page.addEventListener("keydown", e => {
            if (e.target.matches(".attr")) attrContentUpdate(e);
            else if (e.target.matches(".attr-name")) modAttrNameFix(e);
            else if (e.target.matches(".db-page-name")) editDBPageName(e);  // DB 이름 변경
        });

        // 체인지 이벤트
        page.addEventListener("change", e => {
            if (e.target.matches(".db-img-upload")) addAttrImage(e);
            else if (e.target.matches(".db-file-upload")) addAttrFile(e);
        })
    })
}

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
    console.log(block);
    const dbBlockTemp = `
    <div class="db-block database_case" data-block-id="` + block.displayId + `">
        <div class="hide" data-attr-option="`+block.displayId+`"></div>
        <div class="db-block-header">
            <div class="db-page-name"></div>
            <div class="db-layout-list">
                <ul>
                    <li class="change-layout" data-dblayout="DB_LIST">리스트</li>
                    <li class="change-layout" data-dblayout="DB_BRD">칸반보드</li>
                    <li class="change-layout" data-dblayout="DB_GAL">갤러리</li>
                    <li class="change-layout" data-dblayout="DB_TBL">표</li>
                </ul>
            </div>
                <div class="db-attr-option">
                    <button class="page-attr-option btn-db-attr">속성</button>
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
        let layout = infoList[0].parent.caseId;
        infoList.forEach((pagevo, idx) => {
            if(idx == 0){
                let parentVO = pagevo.parent;
                // let parentDiv = document.querySelectorAll('[data-block-type="DATABASE"]');
                let parentDiv = document.querySelectorAll('.database_case');
                console.log(parentDiv);
                // DB블럭에 DB의 페이지 정보를 속성에 추가
                parentDiv.forEach(DBele => {
                    let tagId = DBele.getAttribute("data-block-id");
                    if(tagId == disId){
                        DBele.setAttribute("data-page-id", parentVO["pageId"]);
                        DBele.setAttribute("data-layout", parentVO["caseId"]);
                        DBele.querySelector(".db-page-name").textContent = parentVO["pageName"];
                    }
                });
            } else {
                caseInfo.push(pagevo);
            }
        })
        listLayoutEditor(caseInfo, disId, layout);
	})
	.catch(err => console.log(err));
}

// DB 하위 페이지 생성
function insertDBpage(e){
    let caseBlock = e.target.closest('[data-layout]');
    let pageInfo = {};  // 하위페이지 만들 정보

    let nowLayout = caseBlock.getAttribute("data-layout");
    pageInfo['parentBlockId'] = caseBlock.getAttribute("data-block-id");    // db case page의 아이디
    pageInfo['displayId'] = uuidv4();   // 랜덤 아이디 생성 ramdomUUID

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
        //result = [PageVO, BlockVO, AttrList]
        let caseBody = caseBlock.querySelector('.db-block-body');
        let targetNode = e.target.closest('.add-page-div');
        let block;

        if(nowLayout != 'DB_TBL'){
            if(nowLayout == "DB_LIST"){
                block = dblistBlock(result);
                // 레이아웃용 클래스
                let selector = `[data-page-id="${result.page.pageId}"] .attr-list [data-attrid]`;
                caseBody.querySelectorAll(selector).forEach(tag => {
                    tag.classList.add("inlineTags");
                })
            }
            if(nowLayout == "DB_BRD") block = dbBrdBlock(result);
            if(nowLayout == "DB_GAL") block = dbGalBlock(result);
            targetNode.insertAdjacentHTML("beforebegin", block);
        }

        if(nowLayout == "DB_TBL"){
            let attrList = result.attrList;
            let uniqueAttr = [];
            let getAttr = {};
            for(let attr of attrList){
                let dui = attr.dbUseId;
                if(!getAttr[dui]){  // getAttr[dui]이 null 또는 undefined인지 체크
                    uniqueAttr.push(attr);
                    getAttr[dui] = true;
                }
            }
            block = dbTblBlock(result); // tbl의 블럭은 Node로 반환된다.
            
            // 속성 노드
            let attrNodes = dbTblAttrBlock(attrList, uniqueAttr);
            attrNodes.forEach(attrNode => {
                block.append(attrNode);
            })
            targetNode.prepend(block);
        }

        allList(); // 사이드바 리로드
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
    data['creUser'] = document.getElementById("UserInfoMod").querySelector(".email").textContent;
    data['workId'] = document.getElementById("TitleWid").value
    // console.log(data);
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

async function editDBPageName(e){
    const titleDiv = e.target;
    const pageId = e.target.closest("[data-page-id]").getAttribute("data-page-id");
    let inputText;
    
    if(e.type=="dblclick"){
        titleDiv.setAttribute("contenteditable", true);
        titleDiv.focus();
    }
    if(e.type=="keydown"){
        if( e.keyCode === 13){
            titleDiv.removeAttribute("contenteditable");
            inputText = titleDiv.textContent;
            console.log(inputText);

            let result = await registerPNAjax(pageId, inputText);
            if(result){
                // 변경 내용 화면에 반영
                titleDiv.textContent = inputText;
                const side = document.querySelector("#side");
                const pageDiv = side.querySelector(`[data-id="${pageId}"]`);
                pageDiv.querySelector(".pageName").textContent = `  ${inputText}`;
                pageDiv.setAttribute("data-name", inputText);

                // 히스토리 업데이트
                let displayId = e.target.closest(".database_case").getAttribute("data-block-id");
                let data = {
                    'workId' : document.getElementById("TitleWid").value,
                    'pageId' : pageId,
                    'upUser' : document.getElementById("UserInfoMod").querySelector(".email").textContent,
                    'displayId' : displayId
                }
                dbhistoryUpdate(data);
            }
        }
    }
}

async function registerPNAjax(pageId, pageName){
    let text;
    await fetch(`/pageNewName?pageId=${pageId}&pageName=${pageName}`, {
        method : 'get',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.json())
    .then(result => {
        text = result.result;
    });
    return text;
}

// 페이지 히스토리 업데이트
function dbhistoryUpdate(data){
    //data = { workId, pageId, upUser(or creUser), displayId }

    fetch("/db/pageHistoryUpdate",{
        method : 'POST',
        body : JSON.stringify(data),
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(err => console.log(err));
}