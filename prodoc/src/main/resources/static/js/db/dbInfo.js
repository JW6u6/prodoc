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
            - 기존 페이지 레이아웃에
                <div class="db_attrList">
                    여기에 속성들 보이기
                </div>
                <div class="dataPage_blocks">
                    여기에 블럭들 보이기
                </div>
              ▲ 이것좀 추가해주세요~
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
function getDataInfo(pageId){    
    // 1. view_pageattr 조회 > 현재 사용중인 속성 리스트 가져오기
    fetch(`getDataPageAttr?pageId=${pageId}`,{
        method : 'get',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.json())
    .then(attrList => {
        // 2. 페이지 이름 뒤에 속성 div 추가하기
        // 3. 다중값 속성 체크해서 속성에 맞게 DIV 형성
        
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
        })

        let attrDiv = document.createElement("div");
        uniqueAttr.forEach( uniqueAttr => {
            // 유니크한 속성끼리 묶어줍니다.
            let attrCase = document.createElement("div");
            attrCase.setAttribute("data-duse-id", uniqueAttr.dbUseId);
            attrCase.setAttribute("data-attr-order", uniqueAttr.numbering);
            attrCase.setAttribute("data-attrid", uniqueAttr.attrId);
            let viewClass = uniqueAttr.displayCheck == 'TRUE' ? 'view-visible' : 'hide';
            attrCase.classList.add(viewClass, "attr-name");


        })


        // 3. 타이틀 뒤에 속성 div insertbefor
        let titleEle = document.querySelector(".container");   // ✅title 태그가 생기면 title태그로 바꾸기
        titleEle.after(attrDiv);
    })
    
}

// 데이터베이스에서 페이지를 클릭했을때 페이지 모달
function openDapaPage(pageId){
    // 페이지 정보 가져오세요
    fetch(`/pageInfo?pageId=${pageId}`,{
        method : 'get',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.json())
    .then(pageVO => {
        let container = document.querySelector(".container");
        let pageModal = `
            <div class="db_dagePage">
                <div>
                    <button class="view_change">□</button>
                    <button class="dbPage_close">✕</button>
                </div>
                <div class="pageName">${pageVO.pageName}</div>
                <div class="db_attrList">
                    여기에 속성들 보이기
                </div>
                <div class="dataPage_blocks">
                    여기에 블럭들 보이기
                </div>
            </div>
        `
        // 모달 틀 insert
        container.insertAdjacentHTML("afterend", pageModal);
    
    
        // insert된 div 내부에 속성 append
    })
    .catch(err => console.log(err));
}

// 데이터베이스 페이지를 오픈했을 때
function openDatabase(pageId){
    fetch(`getDatabaseBlock?pageId=${pageId}`,{
        method : 'get',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(response => response.text())
    .then(displayId => {
        console.log(displayId);
        // let div = createDBblock(displayId);
        
    })
    .catch(err => console.log(err));
}