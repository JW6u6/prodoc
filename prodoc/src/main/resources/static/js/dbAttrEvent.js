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

// 클릭 attr 클릭 이벤트
function updateContent(e){
    // e.target.setAttribute("contenteditable", "true");
    let attrId = e.target.getAttribute("data-attrid");
    if(attrId == 'A_TEXT' || attrId == 'NUM'){
        let type = 'text';
        if (attrId == 'NUM') type = 'number';
        let attrDiv = e.target.querySelector(".attr");
        let attrContent = attrDiv.textContent
        attrDiv.remove();
        let inputTag = `
        <input type="${type}" value="${attrContent}" class="attr"/>
        `
        e.target.insertAdjacentHTML("afterbegin", inputTag);
        e.target.querySelector('input').focus();
    }else if(attrId == 'IMG'){
        console.log("이미지");
        e.target.querySelector('input').click()
    }else if(attrId == 'TAG'){
        console.log("태그");
    }else if(attrId == 'STATE'){
        console.log("상태");
    }else if(attrId == 'CAL'){
        // ✅ 캘린더 모달로 따로 만들어야할듯
        console.log("날짜");
        let input = e.target.querySelector('input')
        let event = new KeyboardEvent("keydown", {
            keyCode : 113
        })
        input.dispatchEvent(event);

    }else if(attrId == 'USER'){
        let tag = e.target
        let pageId = e.target.closest('[data-layout]').getAttribute('data-page-id');
        getMembers(pageId, tag);    // 유저 목록 모달 open
    }else if(attrId == 'MEDIA'){
        console.log("미디어");
    }else if(attrId == 'CHECK'){
        console.log("체크박스");
    }else if(attrId == 'URL'){
        let aTag = e.target.querySelector('a')  // 클래스 : hide 지우기
        aTag.classList.remove('hide');
        aTag.setAttribute("contenteditable", "true");
        aTag.focus();
    }
}

// 페이지에 해당하는 속성 div
function getAttrList(attrs){    // 속성
    let useAttr = '';
    console.log(attrs);

    attrs.forEach((attr, idx) => {
        let checkOp = '';

        let displayOption = 'view-visible';
        let content = attr.attrContent;
        if(attr.attrId == 'CUSER' || attr.attrId == 'UUSER' || attr.attrId == 'USER') content = attr.nickname + '(' + content + ')';
        if(attr.displayCheck == "FALSE") displayOption = 'hide';
        if(attr.attrContent == null) content = '';
        // 다중값 속성일때
        if(attr.attrId == 'USER' || attr.attrId == 'TAG'){
            if((idx != 0 && attr.dbUseId != attrs[idx-1].dbUseId) && (idx != attrs.length-1 && attr.dbUseId != attrs[idx+1].dbUseId)){
                // 값이 하나일때
                useAttr += `
                <div class="attrs attr-case" data-attrid="${attr.attrId}" data-duse-id="${attr.dbUseId}" data-duse-id="${attr.dbUseId}">
                    <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                        ${content}
                    </div>
                </div>
                `
            }else if((idx != 0 && attr.dbUseId != attrs[idx-1].dbUseId) && (idx != attrs.length-1 && attr.dbUseId == attrs[idx+1].dbUseId)){
                // 다중값 시작
                useAttr += `
                <div class="attrs attr-case" data-attrid="${attr.attrId}" data-duse-id="${attr.dbUseId}" data-duse-id="${attr.dbUseId}">
                    <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                        ${content}
                    </div>
                `
            }else if( (idx != 0 && attr.dbUseId == attrs[idx-1].dbUseId) && (idx != attrs.length-1 && attr.dbUseId == attrs[idx+1].dbUseId)){
                // 다중값 중간
                useAttr += `
                <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                    ${content}
                </div>
                `
            }else if((idx != 0 && attr.dbUseId == attrs[idx-1].dbUseId) && (idx != attrs.length-1 && attr.dbUseId != attrs[idx+1].dbUseId)){
                // 다중값 끝
                useAttr += `
                    <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                        ${content}
                    </div>
                </div>
                `
            }
        } else {
        // 한 속성당 하나의 값만 가질 때
        if(attr.attrId == 'CHECK'){ // 체크박스 생성
            if(attr.attrContent == 'TRUE') checkOp = 'checked';
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr-case" data-attr-order="${attr.numbering}">
                <input type="checkbox" ${checkOp} class="dbattr-check">
            </div>
            `
        }
        if(attr.attrId == 'URL'){   // URL aTag 생성
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr-case" data-attr-order="${attr.numbering}">
                <a class="attr attrAtag ${attr.attrContent == null ? 'hide' : ''}" href="${attr.attrContent == null ? '' : attr.attrContent}">${attr.attrContent == null ? '' : attr.attrContent}</a>
            </div>
            `
        }
        if(attr.attrId == 'CAL'){   // 날짜
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr-case" data-attr-order="${attr.numbering}">
                <div class="attr inlineTags">${content}</div>
            </div>
            `
        }
        if(attr.attrId == 'A_TEXT' || attr.attrId == 'NUM' || attr.attrId == 'MEDIA'){ // 텍스트 박스, 숫자, 파일
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr-case" data-attr-order="${attr.numbering}">
                <div class="attr inlineTags">${content}</div>
            </div>
            `
        }
        if(attr.attrId == 'STATE'){ // 상태
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr-case" data-attr-order="${attr.numbering}">
                <div class="attr inlineTags">${content}</div>
            </div>
            `
        }
        if(attr.attrId == 'IMG'){ // 이미지
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr-case" data-attr-order="${attr.numbering}">
                <img class="attr inlineTags db-img" style="width:50px;" />
                <input type="file" style="display:none;" class="db-img-upload" accept="image/*">
            </div>
            `
        }
        if(attr.attrId == 'CDATE' || attr.attrId == 'CUSER' || attr.attrId == 'UDATE' || attr.attrId == 'UUSER'){ // 수정 불가 속성
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr-case" data-attr-order="${attr.numbering}">
                <div class="attr inlineTags">${content}</div>
            </div>
            `
        }
        }
    });
    return useAttr;
}

// 속성 값 수정 ✅히스토리 업데이트
function updateAttrContent(data){
    // data = pageUseId, attrContent 필요
    fetch("updateAttrContent", {
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

// 속성 div textcontent 수정
function attrContentUpdate(e){
    if(e.keyCode === 13){
        let pui = e.target.parentElement.getAttribute("data-puse-id");
        let targetAttr = e.target.parentElement.getAttribute("data-attrid");
        let data = {};      // 속성 update ajax에 넘겨줄 데이터

        e.preventDefault();
        e.target.blur();        // 엔터 이벤트 막기

        let attrCase = e.target.parentElement;
        let value = e.target.value
        e.target.remove();  // input tag 삭제
        let addContent = `
        <div class="attr inlineTags">${value}</div>
        `
        attrCase.insertAdjacentHTML("afterbegin", addContent);
        if(targetAttr != null){
            data['pageUseId'] = pui;
            data['attrContent'] = value;
            updateAttrContent(data);
        }

        // url -> aTag 수정
        if(e.target.classList.contains('attrAtag') == true){
            let insertUrl = urlPatternCheck(e.target.innerText);
            e.target.innerText = insertUrl;
            e.target.setAttribute("href", insertUrl);
            console.log(insertUrl);
            if (insertUrl=='') e.target.classList.add('hide');
            data['pageUseId'] = e.target.closest('[data-puse-id]').getAttribute("data-puse-id");
            data['attrContent'] = insertUrl;
            updateAttrContent(data);
        }

        e.target.removeAttribute("contenteditable");    // contenteditable 제거
    }
}

// 이미지 추가
function addAttrImage(e){
    if(e.target.files[0] != null){
        let reader = new FileReader;
        console.log(reader);
        reader.onload = function(data){
            console.log(e.target.previousElementSibling)
            e.target.previousElementSibling.setAttribute("src", data.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        
    }
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
    updateAttrContent(data);
}

// url 패턴 체크
function urlPatternCheck(text){
    let url = text;
    let check = text.substr(0, 4);
    console.log("check : ", check);
    if(check == "http"){
        return url;
    } else if(check == "www."){
        return "http://" + url;
    } else if(text == ''){
        return url;
    } else  return "http://www." + url;
}

// 해당 워크스페이스의 모든 멤버 조회
function getMembers(pageId, tag){
    let childList = tag.children    // 마지막 자식은 제외해야 함
    fetch("/dbAttr/getWorkMembers", {
        method : 'post',
        body : pageId,
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(result => {
        let modal = document.createElement('div');
        modal.setAttribute("data-attr-modal", "");
        modal.classList.add('db-modal');
        tag.append(modal);
        tag.classList.add("modal-top"); // relative 속성 일시적으로 추가 제거 위함
        modal.style.top = -100%
        modal.setAttribute("class", "view");
        let option = '<div class="close-modal">✕</div>';
        for(let i=0; i<childList.length-1; i++){
            let content = childList[i].innerText;
            let pui = childList[i].getAttribute("data-puse-id");
            option += `
            <div class="inlineTags this-value" data-puse-id="${pui}">
                ${content}
                <button class="delete-attr">✕</button>
            </div>
            `;
        }
        option += `<hr>`;
        result.forEach(user => {
            option += `
            <div data-user-email="${user.email}" class="get-value">${user.nickname}(${user.email})</div>
            `
        });
        modal.innerHTML = option;

        // 멤버 추가 이벤트
        document.querySelectorAll('.get-value').forEach(tag => {
            tag.addEventListener("click", async(e) => {
                let content = e.target.innerText;
                let email = e.target.getAttribute("data-user-email");
                let dUseId = e.target.closest("[data-duse-id]").getAttribute("data-duse-id");
                let pageId = e.target.closest("[data-page-id]").getAttribute("data-page-id");
                let check = 'true';
                tag.parentElement.querySelectorAll(".this-value").forEach(item => {
                    if( item.innerText.indexOf(e.target.innerText) != -1 ){
                        alert("이미 등록된 멤버입니다");
                        check = 'false';
                    }
                })
                if(check == 'true'){
                    data = {};
                    data['pageId'] = pageId;
                    data['attrContent'] = email;
                    data['dbUseId'] = dUseId;

                    let caseDiv = e.target.closest('.attr-case');
                    let tagList = e.target.closest('.attr-case').querySelectorAll('.attr');
                    let getDiv = e.target.closest('.attr-case').querySelector('.attr');
                    if(tagList.length == 1 && getDiv.innerText == ''){
                        data['pageUseId'] = getDiv.getAttribute('data-puse-id');
                        updateAttrContent(data);
                        getDiv.innerText = content;
                        let valDiv = e.target.parentElement.querySelector('.this-value');
                        valDiv.innerText = content;
                    } else {
                        let pui = await insertAttrContent(data);
                        console.log(pui);
                        let number = e.target.closest('.attr-case').querySelector("[data-attr-order]").getAttribute("data-attr-order");
                        let insertDiv = `
                        <div data-duse-id="${dUseId}" data-puse-id="${pui}" data-attrid="USER" class="view-visible attr" data-attr-order="${number}">
                            ${content}
                        <div>
                        `
                        let valListDiv = `
                        <div class="inlineTags this-value" data-puse-id="${pui}">
                            ${content}
                            <button class="delete-attr">✕</button>
                        </div>
                        `
                        caseDiv.insertAdjacentHTML("beforeend", insertDiv);
                        e.target.parentElement.querySelector('hr').insertAdjacentHTML("beforebegin", valListDiv);
                    }
                }
            })
        })

        // 삭제 이벤트
        document.querySelectorAll(".delete-attr").forEach(tag => {
            tag.addEventListener("click", e => {
                let pui = e.target.closest("[data-puse-id]").getAttribute("data-puse-id");
                let data = {};
                data['pageId'] = e.target.closest("[data-page-id]").getAttribute("data-page-id");
                data['dbUseId'] = e.target.closest("[data-duse-id]").getAttribute("data-duse-id");
                let check = e.target.parentElement.parentElement.querySelectorAll('.this-value').length;
                console.log(check)
                if(check>1){
                    deleteAttrContent(pui);
                } else if(check==1){
                    data['pageUseId'] = pui;
                    data['attrContent'] = null;
                    updateAttrContent(data);
                }
                e.target.closest(".attr-case").querySelector(`[data-puse-id="${pui}"]`).remove();
                e.target.parentElement.remove();

            });
        })
    })
    .catch(err => console.log(err))
}

async function insertAttrContent(data){
    // pageId, attrContent, dbUseId
    let pageUseId = '';
    await fetch("insertAttrContent",{
        method : 'post',
        body : JSON.stringify(data),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(result => {
        pageUseId = result.result
    })
    .catch(err => console.log(err));
    return pageUseId;
}

function deleteAttrContent(pui){
    fetch("deleteAttrContent",{
        method : 'post',
        body : pui,
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
}

// 다중속성일때 삭제 전 남아있는 attr 체크 > 반환값이 1이면 updateAttrContent 실행, 1이상이면 delete
async function pageAttrCheck(data){
    let ckeck = 'false';
    await fetch("pageAttrCheck", {
        method : 'post',
        body : JSON.stringify(data),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(result => {
        let num = Number(result.result);
        if(num>1) ckeck = 'true';
    })
    .catch(err => console.log(err));
    return ckeck;
}