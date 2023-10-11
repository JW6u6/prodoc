// 페이지 클릭시 페이지 타입을 체크
/*
        // 📌페이지 불러오는 함수에 추가
        let pageType = await pageTypeCheck(pageId);
        if (pageType == 'DATABASE'){
            데이터베이스일때
        } else if (pageType == 'DATA_PAGE'){
            속성 추가해주기 + 원래대로
        } else {
            원래대로
        }

        페이지 클릭했을 때
        1. 페이지 타입 구분한다
        2-1. 데이터베이스 일 때
            - 페이지아이디로 displayId 불러와서 DB블럭 형성하는 함수 ㄱㄱ
        2-2. 데이터 페이지 일 때
            - 기존 페이지 레이아웃에 아래 태그 추가
                <div class="db_attrList">
                    여기에 속성들 보이기
                </div>
                <div class="dataPage_blocks">
                    여기에 블럭들 보이기
                </div>
*/
async function pageTypeCheck(pageId){
    let pageType = '';
    await fetch(`page/pageTypeCheck?pageId=${pageId}`, {
        method : 'get',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.text())
    .then(result => {
        pageType = result;
    })
    .catch(err => console.log(err));
    return pageType;
}

// 데이터베이스를 페이지로 열기(데이터베이스의 pageId)
function getDatabase(dbPageId){
    // 1. 데이터베이스의 디스플레이 아이디 조회
    // 2. 조회된 디스플레이 아이디로 하위페이지리스트 조회
    // 3. 현재 레이아웃 체크
    // 4. view 형성
    
}

// 속성이 보여야하는 페이지
// 속성값만 붙여줌
async function getDataInfo(pageId){    
    // 1. 현재 사용중인 속성 리스트 조회
    await fetch(`getDataPageAttr?pageId=${pageId}`,{
        method : 'get',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.json())
    .then(attrList => {
        // 다중속성값 처리를 위한 forEach
        let uniqueAttr = [];
        let getAttr = {};
        attrList.forEach(attr => {
            let dui = attr.dbUseId;
            if(!getAttr[dui]){ 
                // 해당 속성이 중복이 아니면 uniqueAttr에 담는다.
                uniqueAttr.push(attr);
                getAttr[dui] = true;
            }
        });

        // 2. 필요한 Nodes 생성
        let attrDiv = document.createElement("div");
        let attrTags = dbTblAttrBlock(attrList, uniqueAttr);    // 노드 배열

        attrTags.forEach( node => {
            let topDiv = document.createElement("div");
            if(node.classList.contains("hide")) topDiv.classList.add("hide");
            topDiv.classList.add("attr-line");
            
            let attrCase = document.createElement("div");
            attrCase.setAttribute("data-duse-id", node.getAttribute("data-duse-id"));
            attrCase.setAttribute("data-attr-order", node.getAttribute("data-attr-order"));
            attrCase.setAttribute("data-attrid", node.getAttribute("data-attrid"));
            attrCase.setAttribute("draggable", true);
            attrCase.classList.add("attr-name", "inlineTags");
            attrCase.addEventListener("click", openpageAttrOption);
            let attrName = '';

            node.querySelectorAll(".attr").forEach(childNode => {
                childNode.classList.add("inlineTags");
            })

            uniqueAttr.forEach( attr => {
                if( node.getAttribute("data-duse-id") == attr.dbUseId ) attrName = attr.attrName;
            })
            attrCase.textContent = attrName;
            node.classList.add("inlineTags");

            topDiv.append(attrCase, node);
            attrDiv.append(topDiv);
        })  // 노드 forEach문 종료


        // 3. 속성 append
        let titleEle = document.querySelector(".db_attrList");
        console.log(titleEle);
        titleEle.after(attrDiv);

        datapageMove(); // 속성 드래그 이벤트 등록
        // 속성 등록, 삭제, 수정 이벤트 등록
    })
    
}

// 데이터베이스에서 하위 페이지 클릭
function getDatapageId(e){
    let pageId = e.target.closest("[data-page-id]").getAttribute("data-page-id");
    console.log(pageId);
    openDataPage(pageId);
}

// 데이터베이스에서 페이지를 클릭했을때 페이지 모달
function openDataPage(pageId){
    fetch(`/pageInfo?pageId=${pageId}`,{
        method : 'get',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.json())
    .then( pageList => {
        let pageVO = pageList[0];
        let container = document.querySelector(".container");
        let pageModal = `
            <div class="db_dataPage">
                <div>
                    <button class="view_change">❒</button>
                    <button class="dbPage_close">✕</button>
                </div>
                <div class="pageName">${pageVO.pageName}</div>
                <div class="db_attrList"></div>
                <div class="dataPage_blocks"></div>
            </div>
        `
        // 모달 틀 insert
        container.insertAdjacentHTML("beforeend", pageModal);
        
        // insert된 div 내부에 속성 append
        let attrDiv = document.querySelector(".db_attrList");
        let attrList = '';
        attrDiv.append(attrList);
        getDataInfo(pageId);

        // 모달 이벤트
        document.querySelector(".view_change").addEventListener("click", e => {          
            selectPage(pageId);
        })
        document.querySelector(".dbPage_close").addEventListener("click", e => {
            document.querySelector(".db_dataPage").remove();
        })
    })
    .catch(err => console.log(err));
}

// 데이터베이스 하위 페이지
async function createDataPage(pageId){
    let container = document.querySelector(".container");
    
    let attrs = document.createElement("div");
    attrs.classList.add("db_attrList");
    let blocks = document.createElement("div");
    blocks.classList.add("dataPage_blocks");
    // container.append(attrs, blocks);
    // ✅ 블럭이 들어가는 위치 확인, 작성한 태그들 컨테이너 안에 넣기
    container.before(attrs);

    // 사용중인 속성 append
    await getDataInfo(pageId);
}

// 데이터베이스 페이지를 오픈했을 때
function openDatabase(pageId){
    fetch(`getDatabaseBlock?pageId=${pageId}`,{
        method : 'get',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.json())
    .then(block => {
        let targetDom = document.querySelector(".container");
        targetDom.innerHTML = '';

        // 데이터베이스 탬플릿 형성
        let database = createDBblock(block);
        targetDom.insertAdjacentHTML("afterbegin", database);

        // 하위페이지 불러오기
        getChildList(block.displayId);
    })
    .catch(err => console.log(err));
}

// 데이터베이스 하위페이지 아이디로 데이터베이스 DBBlockVO 조회
async function getDatabaseDBBlock(pageId){
    let dbblock;
    await fetch(`getDatabaseInfo?pageId=${pageId}`,{
        method : 'get',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.json())
    .then(result => dbblock = result)
    .catch(err => console.log(err));
    return dbblock;
}

// 하위페이지 속성 편집 모달
function openpageAttrOption(e){
    let modal = document.createElement("div");
    modal.classList.add("pageAttr_option")
    modal.style.position = 'absolute';
    modal.style.background = "white";
    let closeBtn = document.createElement("button");
    e.target.style.removeProperty("position");
    closeBtn.textContent = '✕';
    closeBtn.addEventListener("click", e => {
        e.target.closest(".pageAttr_option").remove();
    });
    let input = document.createElement("input");
    input.value = e.target.innerText;
    input.classList.add("thisAttrName", "inlineTags")
    let submitBtn = document.createElement("button");
    submitBtn.classList.add("inlineTags");
    submitBtn.vlaue = '수정';
    submitBtn.addEventListener("click", pageAttrnameUpdate);
    submitBtn.addEventListener("keydown", pageAttrnameUpdate);
    let attrDel = document.createElement("div");
    attrDel.textContent = '속성 삭제';
    attrDel.addEventListener("click", e => {
        // 속성 삭제 이벤트
    });


    modal.append(closeBtn, input, submitBtn, attrDel);
    e.target.append(modal);
    e.target.style.position = "relative";
}

function pageAttrnameUpdate(e){
    const input = e.target.closest(".pageAttr_option").querySelector(".thisAttrName");
}