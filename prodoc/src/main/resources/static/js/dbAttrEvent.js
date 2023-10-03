// case block 아이디로 해당 db에 사용된 속성 리스트 리턴하는 AJAX
async function getUseAttrList(caseBlockId){
    let url = 'getAllPageAttr?parentId=' + caseBlockId;
    let list = [];
    await fetch(url, {
        method : 'get'
    })
    .then(response => response.json())
    .then(attrList => {
        attrList.forEach(item => list.push(item))
    })
    .catch(err => console.log(err))
    // console.log(list);
    return list;
}

// 속성 뷰 DOM 형성
async function createUesList(caseBlockId){
    let div = document.querySelector('[data-attr-option="'+caseBlockId+'"]');
    div.innerHTML = "";

    let attrList = await getUseAttrList(caseBlockId);
    console.log(attrList);

    let attrDiv = `<div class="hide">사용속성목록</div>`
    attrList.forEach(attr => {
        let viewOption = 'checked';
        if(attr.displayCheck == 'FALSE') viewOption ='';
        attrDiv += `
            <div data-dbuseid=`+attr.dbUseId+`>
                <input type="checkbox" class="attr-view-selector inlineTags" ${viewOption}>
                <div class="inlineTags" data-attr-id="`+attr.attrId+`" data-attr-view="`+attr.displayCheck+`" 
                data-attr-order="`+attr.numbering+`" white-space:nowrap>`+attr.attrName+`</div>
        `;
        if(attr.attrId != 'CUSER' && attr.attrId != 'CDATE' && attr.attrId != 'UUSER' && attr.attrId != 'UDATE' && attr.attrId != 'CAL' && attr.attrId != 'STATE'){
            attrDiv += `<div class="inlineTags del-attr">&#10005;</div>`;
        }

        attrDiv += `</div>`;
    })
    attrDiv += `
        <button class="add-page-attr">속성추가</button>
        <button class="page-attr-option">취소</button>
        `;
    div.insertAdjacentHTML("afterbegin", attrDiv);
}

// 속성 보기 옵션
function attrViewChange(e){
    let caseId =  e.target.closest('[data-block-id]').getAttribute("data-block-id");
    let dbUseId = e.target.closest('[data-dbuseid]').getAttribute("data-dbuseid");
    let viewOp = e.target.nextElementSibling
    if(viewOp.getAttribute("data-attr-view") == 'TRUE') viewOp.setAttribute("data-attr-view", "FALSE");
    else if (viewOp.getAttribute("data-attr-view") == 'FALSE') viewOp.setAttribute("data-attr-view", "TRUE");
    fetch('displayAttrChange', {
        method : 'post',
        body : JSON.stringify({'dbUseId' : dbUseId, 'displayCheck' : viewOp.getAttribute("data-attr-view")}),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(result => {
        if(result.result == "success") getChildList(caseId);
    })
    .catch(err => console.log(err));
}

// 속성 설정 모달 on/off
function pageAttrOption(e){
    let caseBkId = e.target.closest('[data-block-id]').getAttribute("data-block-id");
    let display = document.querySelector('[data-attr-option="'+caseBkId+'"]');
    if(display.getAttribute("class") == 'hide') display.setAttribute("class", 'view');
    else display.setAttribute("class", 'hide');
    createUesList(caseBkId);
}

// 속성 추가 모달
function addPageAttr(e){
    let div = e.target.closest('[data-layout]').querySelector('[data-attr-option]');
    div.setAttribute("class", "view-visible");
    div.innerHTML = "";

    let addTag = `<div>타입선택</div>`;
    fetch("pageAttrList")
    .then(response => response.json())
    .then(attrList => {
        attrList.forEach(attr => {
            if(attr.attrId == 'STATE' || attr.attrId == 'CDATE' || attr.attrId == 'CUSER' || attr.attrId == 'UDATE' || attr.attrId == 'UUSER') return;
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
async function registAttr(e){
    let check = 'true';    //중복체크를위한 변수
    let attrInfo = {};
    attrInfo['attrId'] = e.target.parentElement.querySelector('[name="useAttrId"]').value;
    attrInfo['attrName'] = e.target.parentElement.querySelector('[name="useAttrName"]').value;
    attrInfo['caseBlockId'] = e.target.closest('[data-attr-option]').getAttribute("data-attr-option");

    let attrList = await getUseAttrList(attrInfo['caseBlockId']);
    attrList.forEach(item => {
        if(item.attrId == attrInfo['attrId'] && item.attrName == attrInfo['attrName'] ){
            alert("해당 속성이 이미 존재합니다.");
            check = 'false';
            return;
        }
    })

    if(check == 'true'){
        fetch("insertDbAttr", {
            method : 'post',
            body : JSON.stringify(attrInfo),
            headers : { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(result => {
            console.log(result.caseBlock);
            createUesList(result.caseBlock);
        })
    }
}

// DB 속성 삭제 ✅프로시저 수정하기
function deleteAttr(e){
    let caseId = e.target.closest('[data-attr-option]').getAttribute("data-attr-option");
    let dbUseId = e.target.closest('[data-dbuseid]').getAttribute("data-dbuseid");
    let url = "deleteDbAttr?dbUseId=" + dbUseId;
    fetch(url)
    .then(response => {
        let attrDiv = e.target.closest('[data-dbuseid]');
        attrDiv.remove();
    })
    .catch(err => console.log(err));
}

// 클릭 -> contenteditable 활성화
function updateContent(e){
    // e.target.setAttribute("contenteditable", "true");
    let attrId = e.target.getAttribute("data-attrid");
    if(attrId == 'A_TEXT'){
        console.log("텍스트");
    } else if(attrId == 'NUM'){
        console.log("숫자");
    }else if(attrId == 'IMG'){
        console.log("이미지");
    }else if(attrId == 'TAG'){
        console.log("태그");
    }else if(attrId == 'STATE'){
        console.log("상태");
    }else if(attrId == 'CAL'){
        console.log("날짜");
    }else if(attrId == 'USER'){
        console.log("유저");
    }else if(attrId == 'MEDIA'){
        console.log("미디어");
    }else if(attrId == 'CHECK'){
        console.log("체크박스");
    }else if(attrId == 'URL'){
        console.log("URL");
        e.target.setAttribute("contenteditable", "true");
    }
}


// 페이지에 해당하는 속성 div
function getAttrList(attrs){    // 속성
    let useAttr = '';

    attrs.forEach(attr => {
        let displayOption = 'view-visible';
        let content = attr.attrContent;
        if(content == null) content = '';
        if(attr.attrId == 'CUSER' || attr.attrId == 'UUSER') content = attr.nickname + '(' + content + ')';
        if(attr.displayCheck == "FALSE") displayOption = 'hide';

        if(attr.attrId == 'CHECK'){
            let checkOp = ''
            if(attr.attrContent == 'TRUE') checkOp = 'checked';
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                <input type="checkbox" ${checkOp} class="dbattr-check">
            </div>
            `
        }
        if(attr.attrId == 'URL'){
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                <a href=${attr.attrContent}>${attr.attrContent}</a>
            </div>
            `
        }


        if(attr.attrId != 'CHECK' && attr.attrId != 'URL'){
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                ${content}
            </div>
            `
        }
    });
    return useAttr;
}

// 체크박스 이벤트
function attrCheck(e){
    let data = {};
    data['pageUseId'] = e.target.closest('[data-puse-id]').getAttribute("data-puse-id");
    if(e.target.checked == true){
        data['attrContent'] = 'TRUE';
    }else if (e.target.checked == false){
        data['attrContent'] = 'FALSE';
    }
    addAttrContent(data);
}

// 속성 값 추가 ✅히스토리 업데이트
function addAttrContent(data){
    // data = pageUseId, attrContent 필요
    fetch("addAttrContent", {
        method : 'post',
        body : JSON.stringify(data),
        headers : {"Content-Type": "application/json"}
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.result);
    })
    .catch(err=>console.log(err));
}


function attrContentUpdate(e){
    if(e.keyCode === 13){
        e.preventDefault();
        console.log(e.target.innerText);
        e.target.setAttribute("contenteditable", "false");
    }
}