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
        e.target.setAttribute("contenteditable", "true");
    } else if(attrId == 'NUM'){
        console.log("숫자");
        e.target.setAttribute("contenteditable", "true");
    }else if(attrId == 'IMG'){
        console.log("이미지");
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
        console.log("유저");
        // 태그할 유저 데려오기
        let tag = e.target
        let pageId = e.target.closest('[data-layout]').getAttribute('data-page-id');
        getMembers(pageId, tag);
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
    // attrList 재생성(중복값)
    let useAttr = '';
    attrs.forEach(attr => {
        let displayOption = 'view-visible';
        let content = attr.attrContent;
        if(attr.attrId == 'CUSER' || attr.attrId == 'UUSER' || attr.attrId == 'USER') content = attr.nickname + '(' + content + ')';
        if(attr.displayCheck == "FALSE") displayOption = 'hide';
        if(attr.attrContent == null) content = '';

        if(attr.attrId == 'CHECK'){ // 체크박스 생성
            let checkOp = ''
            if(attr.attrContent == 'TRUE') checkOp = 'checked';
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                <input type="checkbox" ${checkOp} class="dbattr-check">
            </div>
            `
        }
        if(attr.attrId == 'URL'){   // URL aTag 생성
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                <a class="attr attrAtag ${attr.attrContent == null ? 'hide' : ''}" href="${attr.attrContent == null ? '' : attr.attrContent}">${attr.attrContent == null ? '' : attr.attrContent}</a>
            </div>
            `
        }
        if(attr.attrId == 'CAL'){   // 날짜 input date 생성
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                <input class="hide" type="date" value="${attr.attrContent == null? '' : attr.attrContent}">
            </div>
            `
        }

        // 다중값 dbUseId, pageId, attrName, attrId가 같은 것들 하나로
        // 태그, 유저, 파일
        // if(attr.attrId == 'TAG' || attr.attrId == 'USER' || attr.attrId == 'MEDIA' ){
        //     useAttr += `
        //     <div>
                
        //     </div>
        //     `
        // }

        if(attr.attrId != 'CHECK' && attr.attrId != 'URL' && attr.attrId != 'CAL'){ // 일반 텍스트 박스
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                ${content}
            </div>
            `
        }
    });
    return useAttr;
}

// 속성 값 수정 ✅히스토리 업데이트
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

// 속성 div textcontent 수정
function attrContentUpdate(e){
    let pui = e.target.getAttribute("data-puse-id");
    let targetAttr = e.target.getAttribute("data-attrid");
    let data = {};      // 속성 update ajax에 넘겨줄 데이터

    if(targetAttr == 'NUM'){
        // ✅✅✅ 한글입력하지 말라고!!!!!
        // if(e.key >= 0 && e.key <= 9)
        let numKey = ''
        e.target.innerText.replace(/[^0-9]/g,'');
        console.log(e.keyCode)
        if((e.keyCode > 48 && e.keyCode < 57 // 숫자
            || e.keyCode == 8 // 백스페이스
            || e.keyCode == 37 || e.keyCode == 39 // 방향키 <-, ->
            || e.keyCode == 46 // delete
            || e.keyCode == 17)){
            console.log("true");
        }  else e.preventDefault();
    }

    if(e.keyCode === 13){
        e.preventDefault();
        e.target.blur();        // 엔터 이벤트 막기

        if(targetAttr != null){
            data['pageUseId'] = pui;
            data['attrContent'] = e.target.innerText;
            // addAttrContent(data);
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
            addAttrContent(data);
        }

        e.target.removeAttribute("contenteditable");    // contenteditable 제거
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
    addAttrContent(data);
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
    fetch("/dbAttr/getWorkMembers", {
        method : 'post',
        body : pageId,
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(result => {
        // let modal = tag.closest('[data-layout]').querySelector('[data-attr-modal]');
        let modal = document.createElement('div');
        modal.setAttribute("data-attr-modal", "");
        modal.classList.add('db-modal');
        tag.append(modal);
        tag.classList.add("modal-top"); // relative 속성 일시적으로 추가 제거 위함
        modal.style.top = -100%
        modal.setAttribute("class", "view");
        let option = '<div class="close-modal">✕</div>';
        result.forEach(user => {
            option += `
            <div data-user-email="${user.email}" class="get-value">${user.nickname}(${user.email})</div>
            `
        });
        modal.innerHTML = option;


        // 멤버 추가 이벤트
        document.querySelectorAll('.get-value').forEach(tag => {
            tag.addEventListener("click", e => {
                console.log(e.target.innerText);    // 일시적으로 보여줄 값
                console.log(e.target.getAttribute("data-user-email"));   //DB에 넣어줄 값
            })
        })
    })
    .catch(err => console.log(err))
}