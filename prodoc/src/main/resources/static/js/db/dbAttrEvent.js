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
    return list;
}

// 속성 뷰 DOM 형성
async function createUesList(caseBlockId){
    let div = document.querySelector('[data-attr-option="'+caseBlockId+'"]');
    div.innerHTML = "";

    let attrList = await getUseAttrList(caseBlockId);
    console.log(attrList);

    let attrDiv = `<div>사용중인 속성</div>`
    attrList.forEach(attr => {
        let viewOption = 'checked';
        if(attr.displayCheck == 'FALSE') viewOption ='';
        attrDiv += `
            <div data-dbuseid=`+attr.dbUseId+`>
                <input type="checkbox" class="attr-view-selector inlineTags" ${viewOption}>
                <div class="inlineTags" data-attr-id="`+attr.attrId+`" data-attr-view="`+attr.displayCheck+`" 
                data-attr-order="`+attr.numbering+`" white-space:nowrap>`+attr.attrName+`</div>
        `;
        if(attr.attrId != 'CUSER' && attr.attrId != 'CDATE' && attr.attrId != 'UUSER' && attr.attrId != 'UDATE' && attr.attrId != 'STATE'){
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

// DB 블럭 속성 추가 모달
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
    let inputValue = e.target.parentElement.querySelector('[name="useAttrName"]').value;
    if(inputValue == "" || inputValue == null){
        alert("추가할 속성을 선택하세요");
        return;
    }
    let check = true;    // 중복체크를위한 변수
    let attrInfo = {};
    attrInfo['attrId'] = e.target.parentElement.querySelector('[name="useAttrId"]').value;
    attrInfo['attrName'] = inputValue;
    attrInfo['caseBlockId'] = e.target.closest('[data-attr-option]').getAttribute("data-attr-option");
    attrInfo['email'] = document.getElementById("UserInfoMod").querySelector(".email").textContent;
    let attrList = await getUseAttrList(attrInfo['caseBlockId']);   // 현재 데이터베이스에서 사용중인 속성 리스트
    attrList.forEach(item => {
        if(attrInfo['attrId'] != "IMG" && item.attrId == attrInfo['attrId'] && item.attrName == attrInfo['attrName'] ){
            alert("해당 속성이 이미 존재합니다.");
            check = false;
            return;
        }
        if(attrInfo['attrId'] == "IMG" && item.attrId == "IMG") {
            alert("대표 이미지는 하나만 추가할수 있습니다.");
            check = false;
            return;
        }
    });
    
    if(check === false) return;
    
    // 선택한 속성을 추가할 수 있을 때
    fetch("insertDbAttr", {
        method : 'post',
        body : JSON.stringify(attrInfo),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(attrs => {
        let layout = e.target.closest("[data-layout]").getAttribute("data-layout");
        let container = document.querySelector(".container");
        let pageList = container.querySelectorAll(".db_block");
        //페이지 아이디 같은지 체크 후에실행
        pageList.forEach((pageNode, idx) => {
            let nodePageId = pageNode.getAttribute("data-page-id");
            attrs.forEach(attr=>{
                if(nodePageId == attr.pageId){
                    console.log(layout);
                    if(layout == "DB_BRD" || layout == "GAL"){
                        //pageNode의 마지막 자식 안에 append
                        let tagStr = getAttrList([attr]);
                        pageNode.lastElementChild.insertAdjacentHTML("beforeend", tagStr);
                    }
                    else if(layout == "DB_LIST"){
                        //pageNode.querySelector(".attr-list")에 append
                        let tagStr = getAttrList([attr]);
                        pageNode.querySelector(".attr-list").insertAdjacentHTML("beforeend", tagStr);
                    }
                    else if(layout = "DB_TBL"){
                        if(idx == 0){
                        // 테이블일경우 thead에 속성이름 추가
                            let attrTitle = `
                                <div draggable="true" data-duse-id="${attr.dbUseId}" data-attr-order="${attr.numbering}" data-attrid="${attr.attrId}" class="view-visible attr-name">
                                    ${attr.attrName}
                                </div>
                            `;
                            pageNode.previousElementSibling.lastElementChild.previousElementSibling.insertAdjacentHTML("afterend", attrTitle);
                        }
                        //pageNode에 append
                        let list = dbTblAttrBlock([attr], [attr]);
                        pageNode.append(list[0]);
                    }   // append 끝
                }
            })
        })  // 새로 생긴 속성 append 하기 위한 forEach문 종료
        // 모달 닫기
        document.querySelectorAll("[data-attr-option]").forEach(modal=>{
            modal.innerHTML = '';
            modal.classList.remove("view");
            modal.classList.add("hide");
        })
    })

}

// DB 속성 삭제
function deleteAttr(e){
    let data = {
        'dbUseId' : e.target.closest('[data-dbuseid]').getAttribute("data-dbuseid"),
        'email' : document.getElementById("UserInfoMod").querySelector(".email").textContent
    }
    console.log(data)
    let caseId = e.target.closest('[data-attr-option]').getAttribute("data-attr-option");
    fetch("deleteDbAttr", {
        method : 'POST',
        body : JSON.stringify(data),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => {
        let attrDiv = e.target.closest('[data-dbuseid]');
        attrDiv.remove();
        let delList = document.querySelectorAll(`[data-duse-id="${data.dbUseId}"]`);
        console.log(data.dbUseId);
        delList.forEach(ele=>{
            ele.remove();
        })
    })
    .catch(err => console.log(err));
}

// attr-case 클릭 이벤트
function updateContent(e){
    console.log("ATTR CASE 클릭 이벤트");
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
        addTagList(e.target);
    }else if(attrId == 'STATE'){
        changeState(e.target);
    }else if(attrId == 'CAL'){
        selectCalAttr(e.target);
    }else if(attrId == 'USER'){
        let tag = e.target
        let pageId = e.target.closest('[data-page-id]').getAttribute('data-page-id');
        getMembers(pageId, tag);    // 유저 목록 모달 open
    }else if(attrId == 'MEDIA'){
        e.target.querySelector("input").click();
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

    attrs.forEach((attr, idx) => {
        let checkOp = '';
        let displayOption = 'view-visible';
        let content = attr.attrContent;
        if(attr.attrId == 'CUSER' || attr.attrId == 'UUSER' || attr.attrId == 'USER') content = attr.nickname + '(' + content + ')';
        if(attr.displayCheck == "FALSE") displayOption = 'hide';
        if(attr.attrContent == null) content = '';
        if(content == '') return;
        // 다중값 속성일때
        if(attr.attrId == 'USER' || attr.attrId == 'TAG'){
            if((idx != 0 && attr.dbUseId != attrs[idx-1].dbUseId) && (idx != attrs.length-1 && attr.dbUseId != attrs[idx+1].dbUseId)){
                // 값이 하나일때
                useAttr += `
                <div class="attrs attr-case ${displayOption}" data-attrid="${attr.attrId}" data-duse-id="${attr.dbUseId}" data-duse-id="${attr.dbUseId}">
                    <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr" data-attr-order="${attr.numbering}">
                        ${content}
                    </div>
                </div>
                `
            }else if((idx != 0 && attr.dbUseId != attrs[idx-1].dbUseId) && (idx != attrs.length-1 && attr.dbUseId == attrs[idx+1].dbUseId)){
                // 다중값 시작
                useAttr += `
                <div class="attrs attr-case ${displayOption}" data-attrid="${attr.attrId}" data-duse-id="${attr.dbUseId}" data-duse-id="${attr.dbUseId}">
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
        if(attr.attrId == 'MEDIA'){    // 파일
            useAttr += `
            <div data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" class="${displayOption} attr-case" data-attr-order="${attr.numbering}">
                <div class="attr inlineTags file-content" data-fileName="${content}">
                    ${content==''? content : content.substring(13)}
                    <button class="inlineTags del-attr-file">✕</button>
                </div>
                <input type="file" style="display:none;" class="db-file-upload">
            </div>
            `
        }
        if(attr.attrId == 'A_TEXT' || attr.attrId == 'NUM'){ // 텍스트 박스, 숫자
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
                <img class="attr inlineTags db-img" style="width:50px;" src="${content == '' ? "" : '/dbFiles/'+content}" />
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

// 속성 값 수정
function updateAttrContent(data){
    // data = pageUseId, attrContent 필요(수정)
    let eventDiv = document.querySelector('[data-puse-id="'+data.pageUseId+'"]');
    console.log(eventDiv)
    const pageEle = eventDiv.closest("[data-page-id]");
    data['pageId'] = eventDiv.closest("[data-page-id]").getAttribute("data-page-id");
    data['email'] = document.getElementById("UserInfoMod").querySelector(".email").textContent;
    data['workId'] = document.getElementById("TitleWid").value;
    data['casePageId'] = eventDiv.closest("[data-block-id]").getAttribute("data-block-id");
    console.log(data);
    fetch("updateAttrContent", {
        method : 'post',
        body : JSON.stringify(data),
        headers : {"Content-Type": "application/json"}
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.result);
        if(result.result=="success"){
            upattrToDbpageViewup(pageEle);  // uuser, udate 항목도 화면에 업데이트
            console.log("속성값 전체 반영하기위한 for문");

            // 속성이 변경되었을 때 모달/DB블럭 전체에 반영
            const changeTags = document.querySelectorAll(`.attr[data-puse-id="${data.pageUseId}"]`);
            changeTags.forEach( async(tag) =>{
                let attrId = tag.getAttribute("data-attrid");
                let content = data.attrContent;
                if(["A_TEXT", "NUM", "CAL", "STATE"].includes(attrId)){
                    tag.innerText = content;
                }
                if(attrId == "CHECK"){
                    let checkOp = content=="TRUE"?true:false;
                    tag.checked = checkOp;
                }
                if(attrId == "URL"){
                    console.log(tag);
                    tag.href = content;
                    tag.innerText = content;
                }
                if(attrId == "MEDIA"){
                    let textDiv= tag.querySelector("div");
                    textDiv.setAttribute("data-fileName", `/dbFiles/${content}`);
                    textDiv.innerText = content.substring(13);
                }
                if(attrId == "IMG"){
                    let imgTag = tag.querySelector("img");
                    imgTag.src = `/dbFiles/${content}`;
                }
                if(attrId == "TAG"){
                    // 값이 존재하지 않거나 하나만 있을 때 변경 적용
                    tag.innerText = (content==''||content==null ? '' : content);
                    let dataTag = tag.cloneNode(true);
                     console.log(tag)
                    addAttrcontentToModal(dataTag);
                }
                if(["USER", "CUSER", "UUSER"].includes(attrId)){
                    // 값이 존재하지 않거나 하나만 있을 때 변경 적용
                    // 이메일, 닉네임 조회용
                    const memberList = await getMembersAjax(data.pageId);

                    memberList.forEach(mem => {
                        if(content=="" || content==null){
                            tag.innerText = '';
                        }
                        if(mem.email == content){
                            content = `${mem.nickname}(${mem.email})`;
                            if(attrId = "USER"){
                                // 빈값에서 새롭게 등록했을 때만 실행됨
                                console.log(tag, "아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ")
                                tag.innerText = content;
                                let dataTag = tag.cloneNode(true);
                                addAttrcontentToModal(dataTag);
                            }
                            else {
                                tag.querySelector("div").innerText = content;
                            }
                        }
                    });
                }
            }); // 속성 아이디에 따른 변경 종료
        }
    })
    .catch(err=>console.log(err));
}

// 속성 div textcontent 수정
function attrContentUpdate(e){
    if(e.keyCode === 13){
        let attrId =  e.target.closest("[data-attrid]").getAttribute("data-attrid");
        let pui = e.target.parentElement.getAttribute("data-puse-id");
        let targetAttr = e.target.parentElement.getAttribute("data-attrid");
        let data = {};      // 속성 update ajax에 넘겨줄 데이터
		
        e.preventDefault();
        e.target.blur();        // 엔터 이벤트 막기
        // 텍스트, 숫자 태그 처리
        if(attrId == 'A_TEXT' || attrId == 'NUM'){
            console.log(e.target)
            let attrCase = e.target.parentElement;
            let value = e.target.value;
            let addContent = `
            <div class="attr inlineTags">${value}</div>
            `;
            e.target.remove();  // input tag 삭제
            attrCase.insertAdjacentHTML("afterbegin", addContent);
            if(targetAttr != null){
                data['pageUseId'] = pui;
                data['attrContent'] = value;
                updateAttrContent(data);
            }
        }

        // url -> aTag 수정
        if(attrId == 'URL'){
            let insertUrl = urlPatternCheck(e.target.innerText);
            e.target.innerText = insertUrl;
            e.target.setAttribute("href", insertUrl);
            if (insertUrl=='') e.target.classList.add('hide');
            console.log(e.target.closest('[data-puse-id]'));
            data['pageUseId'] = e.target.closest('[data-puse-id]').getAttribute("data-puse-id");
            data['attrContent'] = insertUrl;
            updateAttrContent(data);
        }

        // if(e.target.classList.contains(tag-value) == true){
        //     console.log("태그 인풋 이벤트")
        // }

        e.target.removeAttribute("contenteditable");    // contenteditable 제거
    }
}

// 태그리스트 모달
function addTagList(target){
    let parentDiv = target.closest("[data-duse-id]");
    let dui = parentDiv.getAttribute("data-duse-id")

    if(document.querySelector("[data-attr-modal]") !=null ) document.querySelector("[data-attr-modal]").remove();
    target.style.position = "relative";
    let modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.setAttribute("data-attr-modal", "");
    modal.classList.add("view");
    let closeBtn = document.createElement("div");
    closeBtn.classList.add("close-attr-modal");
    closeBtn.innerText = "✕";
    let input = document.createElement("input");
    input.classList.add("tag-value");
    input.addEventListener("keydown", addPageTags);
    modal.append(closeBtn);

    // 사용중인 태그 삭제할 수 있도록 요소 생성.
    parentDiv.querySelectorAll(".attr").forEach(ele =>{
        if(ele.innerText == '') return;
        let nowTag = document.createElement("div");
        nowTag.innerText = ele.innerText;
        nowTag.classList.add("inlineTags", "this-value");
        nowTag.setAttribute("data-puse-id", ele.getAttribute("data-puse-id"));
        let delBtn = document.createElement("button");
        delBtn.classList.add("delete-attr");
        delBtn.innerText = '✕';
        nowTag.append(delBtn);
        modal.append(nowTag);
    })
    modal.append(input);


    // 현재 사용중인 모든 태그 리스트
    fetch("/dbattr/selectAllTags",{
        method : 'post',
        body : dui,
        headers : {"Content-Type" : "application/json"}
    })
    .then(response => response.json())
    .then(tags => {
        let caseDiv = document.createElement("div");
        let tagList = [];
        tags.forEach(tag => {
            if(tag.attrContent == "" || tag.attrContent == null) return;
            if(tagList.indexOf(tag.attrContent) == -1){
                tagList.push(tag.attrContent);
                let tagDiv = document.createElement("div");
                tagDiv.classList.add("get-value");
                tagDiv.addEventListener("click", addPageTags);
                tagDiv.innerText = tag.attrContent;
                caseDiv.append(tagDiv);
            }
        })
        modal.append(caseDiv);
        target.append(modal);
        input.focus();
    })
    .catch(err => console.log(err));
}

// 태그 추가 이벤트
async function addPageTags(e){
    const caseDiv = e.target.closest(".attr-case");
    let thisTags = [];      // 현재 사용중인 태그인지 조회
    let addTag = '';        // 사용자가 입력한 태그
    caseDiv.querySelectorAll(".attr").forEach(ele => {
        thisTags.push(ele.innerText);
    })

    let tagCheck = true;
    if(e.type == 'click'){
        addTag = e.target.innerText;
        if(thisTags.indexOf(addTag) != -1){
            alert("이미 사용중인 태그입니다");
            tagCheck = false;
        }
        if(tagCheck) await insertTagToAttr(caseDiv, thisTags, addTag);
    }

    if(e.type == 'keydown'){
        // 앤터 이벤트
        if(e.keyCode === 13){
            e.preventDefault();
            e.target.blur();    // 원래 엔터 이벤트 막기
            addTag = e.target.value;

            if(thisTags.indexOf(addTag) != -1){
                alert("이미 사용중인 태그입니다");
                tagCheck = false;
            }
            e.target.value = "";
            if(tagCheck) await insertTagToAttr(caseDiv, thisTags, addTag);
        }
    }   // 키다운 이벤트 종료
}

async function insertTagToAttr(caseDiv, thisTags, addTag){

    if(thisTags.indexOf(addTag) == -1){
        console.log("태그 추가");
        let data = {};
        if(thisTags[0] == ""){
        // update
            let attrDiv = caseDiv.querySelector(".attr");
            data['pageUseId'] = attrDiv.getAttribute("data-puse-id");
            data['attrContent'] = addTag;
            console.log("님어디실행중이세요");
            updateAttrContent(data);
        } else {
        // insert
        console.log("여기는 인서트세요");

            data['dbUseId'] = caseDiv.getAttribute("data-duse-id");
            data['pageId'] = caseDiv.closest("[data-page-id]").getAttribute("data-page-id");
            data['attrContent'] = addTag;

            let newPui = await insertAttrContent(data);
            
            // 모든 화면에 동일하게 추가하기 위해 append 위치를 잡기위한 id
            const prevEleId = caseDiv.lastElementChild.previousElementSibling.getAttribute("data-puse-id");
            let modalDataTag;
            const beforeTags = document.querySelectorAll(`[data-puse-id="${prevEleId}"]`);
            beforeTags.forEach(beforeTag=>{
                let newTag = document.createElement("div");
                let num = caseDiv.getAttribute("data-attr-order");
                newTag.setAttribute("data-duse-id", data['dbUseId']);
                newTag.setAttribute("data-puse-id", newPui);
                newTag.setAttribute("data-attrid", "TAG");
                newTag.classList.add("view-visible", "attr");
                newTag.setAttribute("data-attr-order", num);
                newTag.innerText = addTag;
                modalDataTag = newTag
                beforeTag.after(newTag);        // 형제요소 뒤에 추가된 태그 삽입
            })  // 전체 화면 append를 위한 forEach문 종료
            addAttrcontentToModal(modalDataTag);
        }
    }
}

// 다중값 속성에서 속성 등록했을 때 속성값 추가하는 모달에 데이터 append용
function addAttrcontentToModal(tag){
    // 기존 모달에 this-value 클래스를 가진 element가 하나면 upda

    // tag == 복사한 태그
    tag.classList.remove("view-visible", "attr");
    tag.classList.add("inlineTags", "this-value");
    tag.removeAttribute("data-duse-id");
    tag.removeAttribute("data-attrid");
    tag.removeAttribute("data-attr-order");
    const delBtn = document.createElement("button");
    delBtn.innerText='✕';
    delBtn.classList.add("delete-attr");
    tag.append(delBtn);
    console.log(tag);
    const modal = document.querySelector("[data-attr-modal]");
    const lastData = modal.querySelectorAll("[data-puse-id]");
    lastData[lastData.length-1].after(tag);
}

// 이미지 추가
async function addAttrImage(e){
    // 화면에 추가
    if(e.target.files[0] != null){
        let reader = new FileReader;
        reader.onload = function(data){
            e.target.previousElementSibling.setAttribute("src", data.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
    
    // 업로드 진행
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    // let fileName = e.target.files[0].name;
    let newName = await dbattrFileUpload(formData);
    let data = {};
    data['pageUseId'] = e.target.closest("[data-puse-id]").getAttribute("data-puse-id");
    data['attrContent'] = newName;
    updateAttrContent(data);
    }
}

// 속성에 파일 업로드
async function addAttrFile(e){
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    let newName = await dbattrFileUpload(formData);
    let fileDiv = e.target.previousElementSibling;
    fileDiv.innerText = newName.substring(13);
    fileDiv.setAttribute("data-file-name", newName);
    console.log(newName);
    let data = {
        'pageUseId' : e.target.closest("[data-puse-id]").getAttribute("data-puse-id"),
        'attrContent' : newName
    }
    updateAttrContent(data);
    let delBtn = document.createElement("button");
    delBtn.classList.add("inlineTags", "del-attr-file");
    delBtn.innerText = "✕";
    e.target.parentElement.querySelector(".attr").append(delBtn);
}

// 파일 다운로드
function selectFileAttr(e){
    console.log("--------------------------")
    const filename = encodeURIComponent(e.target.getAttribute("data-filename"));
    let URL = `/addrfile/download?id=${filename}`;
    location.href = URL;
}


// 상태 속성 변경
function changeState(eTarget){
    let states = ['WAIT', 'RUN', 'END', 'CANCEL']
    let pui = eTarget.getAttribute("data-puse-id");
    let nowStateDiv = eTarget.querySelector(".attr");

    // 모달 오픈
    if(document.querySelector("[data-attr-modal]") !=null ) document.querySelector("[data-attr-modal]").remove();
    eTarget.style.position = "relative";
    let modal = document.createElement("div");
    modal.style.position = "absolute";
    modal.setAttribute("data-attr-modal", "");
    modal.classList.add("view");
    let closeBtn = document.createElement("div");
    closeBtn.classList.add("close-attr-modal");
    closeBtn.innerText = "✕";
    modal.append(closeBtn);
    states.forEach(state => {
        let selector = document.createElement("div");
        selector.classList.add("get-value");
        selector.innerText = state;
        selector.addEventListener("click", e => {
            let data = {};
            data['pageUseId'] = pui;
            data['attrContent'] = e.target.innerText;
            nowStateDiv.innerText = e.target.innerText;
            closeBtn.click();
            updateAttrContent(data);
            console.log(eTarget.closest("[data-layout]"))
            // 보드 레이아웃에서 속성 변경했을 때 element 이동
            if( eTarget.closest("[data-layout]").getAttribute("data-layout") != null &&
                eTarget.closest("[data-layout]").getAttribute("data-layout") == "DB_BRD"){
                let moveState = data['attrContent'];
                let moveDiv = eTarget.closest(".db_block");
                let stateDiv = eTarget.closest(".state-container").querySelector(`[data-state="${moveState}"]`);
                stateDiv.prepend(moveDiv);
            }
        })
        modal.append(selector);
    })
    eTarget.append(modal);
}

// 날짜 속성 수정
function selectCalAttr(eTarget){
    if(document.querySelector("[data-attr-modal]") !=null ) document.querySelector("[data-attr-modal]").remove();

    eTarget.style.position = "relative";

    let modal = document.createElement("div");
    modal.style.position = "absolute"
    modal.setAttribute("data-attr-modal", "");
    modal.classList.add("view");

    let closeBtn = document.createElement("div");
    closeBtn.classList.add("close-attr-modal");
    closeBtn.innerText = "✕";

    let date = document.createElement("input");
    date.readOnly = true;
    date.classList.add("date-value", "input_text");
    date.value = eTarget.firstElementChild.innerText;
    date.style.display = "inline-block";

    let deleteBtn = document.createElement("div");
    deleteBtn.innerText = "삭제";
    deleteBtn.classList.add("caldel-btn");

    let hrTag = document.createElement("hr");
    let startDate = document.createElement("input");
    startDate.setAttribute("type", "date");
    startDate.classList.add("startDate");
    startDate.addEventListener("change", inputAttrDate);

    let addBtn = document.createElement("button");
    addBtn.classList.add("attrDate-con");
    addBtn.innerText="종료일 추가";

    modal.append(closeBtn, date, deleteBtn, hrTag, startDate, addBtn);

    // 종료일 추가 버튼이벤트
    addBtn.addEventListener("click", e => {
        if (e.target.previousElementSibling.classList.contains("endDate") == false){
            let endDate = document.createElement("input");
            endDate.setAttribute("type", "date");
            endDate.classList.add("endDate");
            endDate.addEventListener("change", inputAttrDate);
            endDate.setAttribute("min", startDate.value);
            e.target.parentElement.insertBefore(endDate, e.target);
            e.target.innerText="종료일 제거";
        } else {
            e.target.previousElementSibling.remove();
            e.target.innerText="종료일 추가";
            // date.value = startDate.value;
            let changeEvt = new CustomEvent("change")
            startDate.dispatchEvent(changeEvt);
        }
    });

    // 날짜 삭제 이벤트
    deleteBtn.addEventListener("click", e => {
        const modal = e.target.parentElement;
        modal.querySelector("input").value = "";
        
        const data = {
            'pageUseId' : e.target.closest("[data-puse-id]").getAttribute("data-puse-id"),
            'attrContent' : ''
        }
        updateAttrContent(data);
    });

    eTarget.append(modal);
}

// 날짜 선택 처리
function inputAttrDate(e){
    let caseDiv = e.target.closest(".attr-case");
    let input = caseDiv.querySelector(".date-value");
    let startDiv = e.target.parentElement.querySelector(".startDate");
    let endDiv = e.target.parentElement.querySelector(".endDate");
    if(endDiv != null){
        input.value = `${startDiv.value}→${endDiv.value}`
    }else{
        input.value = startDiv.value;
    }
    caseDiv.querySelector(".attr").innerText = input.value;

    let data = {};
    data['pageUseId'] = caseDiv.getAttribute("data-puse-id");
    data['attrContent'] = input.value;
    updateAttrContent(data);
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
    if(check == "http"){
        return url;
    } else if(check == "www."){
        return "http://" + url;
    } else if(text == ''){
        return url;
    } else  return "http://www." + url;
}


// 해당 워크스페이스의 모든 멤버 조회 ajax
async function getMembersAjax(pageId){
    let memberList = [];
    await fetch("/dbAttr/getWorkMembers", {
        method : 'post',
        body : pageId,
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(members => {
        memberList = members;
    })
    .catch(err => console.log(err))
    return memberList;
}

// 멤버 등록 이벤트
async function getMembers(pageId, tag){
    if(document.querySelector("[data-attr-modal]") != null) document.querySelector("[data-attr-modal]").remove();
    const childList = tag.children    // 마지막 자식은 제외해야 함
    const userList = await getMembersAjax(pageId);  // 워크스페이스의 모든 멤버들을 불러옴

    // 등록 모달 생성
    const modal = document.createElement('div');
    modal.setAttribute("data-attr-modal", "");
    modal.classList.add('db-modal');
    tag.append(modal);
    tag.classList.add("modal-top"); // relative 속성 일시적으로 추가 제거 위함
    modal.style.top = -100%
    modal.setAttribute("class", "view");
    let option = '<div class="close-attr-modal">✕</div>';
    for(let i=0; i<childList.length-1; i++){
        let content = childList[i].innerText;
        let pui = childList[i].getAttribute("data-puse-id");
        if(childList.length == 1) return;
        option += `
        <div class="inlineTags this-value" data-puse-id="${pui}">
            ${content}
            <button class="delete-attr">✕</button>
        </div>
        `;
    };

    option += `<hr>`;
    userList.forEach(user => {
        option += `
        <div data-user-email="${user.email}" class="get-value">${user.nickname}(${user.email})</div>
        `
    });
    modal.innerHTML = option;

    // 멤버 추가를 위한 이벤트 리스너 
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

                const caseDiv = e.target.closest('.attr-case');
                let tagList = e.target.closest('.attr-case').querySelectorAll('.attr');
                let getDiv = e.target.closest('.attr-case').querySelector('.attr');
                if(tagList.length == 1 && getDiv.innerText == ''){
                    data['pageUseId'] = getDiv.getAttribute('data-puse-id');
                    updateAttrContent(data);
                }
                else {
                    let pui = await insertAttrContent(data);
                    let number = e.target.closest('.attr-case').querySelector("[data-attr-order]").getAttribute("data-attr-order");

                    const prevId = caseDiv.lastElementChild.previousElementSibling.getAttribute("data-puse-id");
                    const prevEles = document.querySelectorAll(`[data-puse-id="${prevId}"]`);
                    let modalData;
                    prevEles.forEach(prevEle => {
                        let newDiv = document.createElement("div");
                        newDiv.getAttribute("data-duse-id", dUseId);
                        newDiv.getAttribute("data-puse-id", pui);
                        newDiv.getAttribute("data-attr-order", number);
                        newDiv.getAttribute("data-attrid", "USER");
                        newDiv.classList.add("view-visible", "attr");
                        newDiv.innerText = content
                        modalData = newDiv;
                        prevEle.before(newDiv);  // 선택요소 뒤에 추가
                    })  // 새로운 유저 화면에 추가 forEach문 종료
                    addAttrcontentToModal(modalData);   // 속성값 편집 모달에 데이터 append
                }

            }
        })
    })
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
    let data = {
        'pageUseId' : pui,
        'email' : document.getElementById("UserInfoMod").querySelector(".email").textContent,
        'workId' : document.getElementById("TitleWid").value
    }
    fetch("deleteAttrContent",{
        method : 'post',
        body : JSON.stringify(data),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);
        let delTags = document.querySelectorAll(`[data-puse-id="${pui}"]`);
        delTags.forEach(tag => {
            //화면에 존재하는 모든 태그 삭제
            tag.remove();
        })
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

// 파일업로드
async function dbattrFileUpload(formData){
    let newName = '';
    await fetch("/dbattr/fileUpload", {
        method : 'post',
        body : formData
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);
        newName = result;
    })
    .catch(err => console.log(err));
    return newName;
}

// 다중값 속성 삭제
function deleteThisAttr(e){
    let attrId = e.target.closest("[data-attrid]").getAttribute("data-attrid");
    if(attrId == "USER"){
        let pui = e.target.closest("[data-puse-id]").getAttribute("data-puse-id");
        let data = {};
        data['pageId'] = e.target.closest("[data-page-id]").getAttribute("data-page-id");
        data['dbUseId'] = e.target.closest("[data-duse-id]").getAttribute("data-duse-id");
        let check = e.target.parentElement.parentElement.querySelectorAll('.this-value').length;
        console.log(check)
        if(check>1){
            deleteAttrContent(pui);
            e.target.closest(".attr-case").querySelector(`[data-puse-id="${pui}"]`).remove();
        } else if(check<=1){
            data['pageUseId'] = pui;
            data['attrContent'] = null;
            updateAttrContent(data);
        }
        e.target.parentElement.remove();
    }

    if(attrId == "TAG"){
        let check = e.target.closest(".attr-case").querySelectorAll(".attr").length
        let delTag = e.target.closest(".this-value");
        let delTagText = delTag.textContent.substring(0, delTag.textContent.length-1);
        let pui = delTag.getAttribute("data-puse-id");
        if(check>1){
            deleteAttrContent(pui);
            e.target.closest(".attr-case").querySelectorAll(".attr").forEach(ele=>{
                if(ele.innerText.indexOf(delTagText) != -1) ele.remove();
            });
            delTag.remove();
        } else {
            //update
            let data = {};
            data['pageUseId'] = pui
            data['attrContent'] = '';
            updateAttrContent(data);
        }
    }
}

// 속성 이름 변경
async function modifyAttrName(e){
    if(e.target.classList.contains("page-attr")) return;
    let dui = e.target.getAttribute("data-duse-id");
    let caseId = e.target.closest("[data-layout]").getAttribute("data-block-id");
    let attrId = e.target.getAttribute("data-attrid");
    if(e.type == 'click'){
        if(['UUSER', 'CUSER', 'CDATE', 'UDATE', 'STATE'].includes(attrId)) return;
        e.target.setAttribute("contenteditable", true);
    }else if(e.type == 'keydown'){
        if(e.keyCode === 13){
            e.preventDefault();
            e.target.setAttribute("contenteditable", false);
            let attrName = e.target.innerText;
            let check = true;
            let attrList = await getUseAttrList(caseId);
            console.log(attrId, attrName)
            attrList.forEach(useAttr => {
                if(useAttr.attrId == attrId && useAttr.attrName == attrName) check = false;
            });
            if(check == false){
                alert("해당 속성이 이미 존재합니다.");
                return;
            }
            let data = {
                'dbUseId' : dui,
                'attrName' : attrName,
                'pageId' : e.target.closest("[data-layout]").getAttribute("data-page-id"),
                'email' : document.getElementById("UserInfoMod").querySelector(".email").textContent,
                'casePageId' : caseId,  // 블럭아이디
                'workId' : document.getElementById("TitleWid").value
            };

            modifyAttrNameAjax(data);
        }

    }
}

function modifyAttrNameAjax(data){
/*
    let data = {
        'dbUseId' : dui,
        'attrName' : attrName,
        'pageId' : e.target.closest("[data-layout]").getAttribute("data-page-id"),
        'email' : document.getElementById("UserInfoMod").querySelector(".email").textContent,
        'casePageId' : caseId,  // 블럭아이디
        'workId' : document.getElementById("TitleWid").value
    };
*/
    fetch("modifyAttrName", {
        method : 'post',
        body : JSON.stringify(data),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
}

// DB에 속성 넘버링 업데이트
function attrNumberUpdate(data){
    fetch("attrNameUpdate", {
        method : 'post',
        body : JSON.stringify(data),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.text())
    .then(result => {
        // console.log(result);
        // console.log(data);
    })
    .catch(err => console.log(err));
}

// 페이지 블럭 drop 이벤트 실행했을 때 넘버링 업데이트
function dbpageNumbering(data){
    fetch("dbpageNumbering", {
        method : 'post',
        body : JSON.stringify(data),
        headers : { "Content-Type": "application/json" }
    })
    .then(response => response.text())
    .then(result => {
        // console.log(result);
    })
    .catch(err => console.log(err));
}

// DB페이지 수정시(블럭) page attr 중 uuser, udate 업데이트, 화면 반영
// 명석씨 블럭수정사항 업데이트되는 부분에 이것좀 넣어주세오
function upblockToDbpageViewup(){
    if(!document.querySelector(".db_attrList")) return;

    const uUserAttr = document.querySelector(".db_attrList")
                        .querySelector('[data-attrid="UUSER"].attr-case .attr');
    const uDateAttr = document.querySelector(".db_attrList")
                        .querySelector('[data-attrid="UDATE"].attr-case .attr');

    const email = document.getElementById("UserInfoMod").querySelector(".email").innerText;
    const nickname = document.getElementById("UserInfoMod").querySelector(".nickname").innerText;
    const uuser = `${nickname}(${email})`

    let nowDate = new Date();
    const udate = `${nowDate.getFullYear()}-${nowDate.getMonth()+1}-${nowDate.getDate()}`
    
    uUserAttr.innerText = uuser;
    uDateAttr.innerText = udate;
}

// DB페이지의 속성이 수정됐을때 uuser, udate 업데이트, 화면 반영
function upattrToDbpageViewup(pageEle){
    // 데이터베이스 블럭에서 속성의 수정
    const uUserAttr = (pageEle.querySelector('[data-attrid="UUSER"].attr') != null ?
                    pageEle.querySelector('[data-attrid="UUSER"].attr') : pageEle.querySelector('[data-attrid="UUSER"] .attr'));
    const uDateAttr = (pageEle.querySelector('[data-attrid="UDATE"].attr') != null ?
                    pageEle.querySelector('[data-attrid="UDATE"].attr') : pageEle.querySelector('[data-attrid="UDATE"] .attr'));

    const email = document.getElementById("UserInfoMod").querySelector(".email").innerText;
    const nickname = document.getElementById("UserInfoMod").querySelector(".nickname").innerText;
    const uuser = `${nickname}(${email})`

    let nowDate = new Date();
    const udate = `${nowDate.getFullYear()}-${nowDate.getMonth()+1}-${nowDate.getDate()}`
    
    uUserAttr.innerText = uuser;
    uDateAttr.innerText = udate;

    // 모달에서 수정했을 때 모달에 있는 속성도 업데이트하기 위함
    upblockToDbpageViewup();
}