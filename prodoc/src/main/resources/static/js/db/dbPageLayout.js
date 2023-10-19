async function listLayoutEditor(dataList, displayId, layout){
    console.log(dataList);
    const dbbody = document.querySelector(`[data-block-id="${displayId}"] .db-block-body`);
    const nowLayouts = document.querySelector(`[data-block-id="${displayId}"]`).querySelectorAll(`[data-dblayout]`);
    nowLayouts.forEach(ele=>{
        if(ele.getAttribute("data-dblayout") == layout) ele.classList.add("lay-pick");
        else ele.classList.remove("lay-pick");
    })

    dbbody.innerHTML = "";
    let pageList = [];  // 삭제되지 않은 페이지 목록
    dataList.forEach(item => {
        if (item.page.deleteCheck == 'FALSE') pageList.push(item);
    });

    switch(layout){
        case 'DB_LIST' :
            pageList.forEach(block => {
                let blockTag = dblistBlock(block);
                dbbody.insertAdjacentHTML("beforeend", blockTag);
            });

            let attrList = document.querySelectorAll('.attr-list');     //속성 레이아웃용
            attrList.forEach(ele => {
                ele.querySelectorAll('div').forEach(tag => {
                    tag.classList.add("inlineTags");
                })
            })
            dbbody.insertAdjacentHTML("beforeend", addDbpage()); 
            break;

        case 'DB_BRD' : 
        let states = ["WAIT", "RUN", "END", "CANCEL"];

        let statesTag = document.createElement("div");
        statesTag.classList.add("stasts");
        states.forEach(state => {
            let stateType = document.createElement("div");
            stateType.textContent = state;
            stateType.setAttribute("data-state-tags", state);
            statesTag.append(stateType);
        })
        dbbody.append(statesTag);

        let caseDiv = document.createElement("div");
        caseDiv.classList.add("state-container");
        states.forEach(state => {
            let stateTag = document.createElement("div");
            stateTag.setAttribute("data-state", state);
            stateTag.classList.add("db-state-box");
            pageList.forEach(info => {
                info.attrList.forEach(attr => {
                    if(attr.attrId == "STATE" && attr.attrContent == state){
                        let blockTag = dbBrdBlock(info);
                        stateTag.insertAdjacentHTML("beforeend", blockTag);
                    }
                })
            })
            stateTag.insertAdjacentHTML("beforeend", addDbpage());            
            caseDiv.append(stateTag);
        })
            dbbody.append(caseDiv);
            break;

        case 'DB_GAL' : 
            pageList.forEach(block => {
                let blockTag = dbGalBlock(block);
                dbbody.insertAdjacentHTML("beforeend", blockTag);
            });
            dbbody.insertAdjacentHTML("beforeend", addDbpage());
            break;

        case 'DB_TBL' :
            let uniqueAttr = [];
            let getAttr = {};
            if(pageList[0]){
                for(let attr of pageList[0].attrList){
                    let dui = attr.dbUseId;
                    if(!getAttr[dui]){  // getAttr[dui]이 null 또는 undefined인지 체크
                        uniqueAttr.push(attr);
                        getAttr[dui] = true;
                    }
                }
            }
            // thead 생성
            let thead = document.createElement("div");
            thead.classList.add("dbtype-tbl", "table-tr", "table-thead");
            for(let i=-1; i<uniqueAttr.length; i++){
                let td = document.createElement("div");
                if(i==-1){
                    td.textContent = "이름";
                }else{
                    td.textContent = uniqueAttr[i].attrName;
                    td.draggable = true;
                    td.setAttribute("data-duse-id", uniqueAttr[i].dbUseId);
                    td.setAttribute("data-attr-order", uniqueAttr[i].numbering);
                    td.setAttribute("data-attrid", uniqueAttr[i].attrId);
                    let displayOption = "view-visible";
                    if(uniqueAttr[i].displayCheck == "FALSE") displayOption = "hide";
                    td.classList.add(displayOption, "attr-name");
                }
                thead.append(td);
            }
            let addAttr = document.createElement("div");    // 속성 추가버튼
            addAttr.setAttribute("class", "inlineTags add-page-attr");
            addAttr.innerHTML = "&#10010;";
            thead.append(addAttr);
            dbbody.append(thead);

            // 데이터 append
            for(let i=0; i<pageList.length; i++){
                let block = pageList[i];
                let tr = dbTblBlock(block);
                let attrs = dbTblAttrBlock(pageList[i].attrList, uniqueAttr);
                attrs.forEach(attr=>{
                    tr.append(attr);
                });
                dbbody.append(tr);
            }
            dbbody.insertAdjacentHTML("beforeend", addDbpage());   
            break;
    };
    dbMoveEvent(layout);
    databaseAllEvent();
}

function updateCase(pageId, layout){
    let data = {"pageId" : pageId, "caseId" : layout};
    data['creUser'] = document.getElementById("UserInfoMod").querySelector(".email").textContent;
    data['workId'] = document.getElementById("TitleWid").value;

    fetch("updateCase",{
        method : "post",
        body : JSON.stringify(data),
        headers : {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        let caseId = result.result.displayId;
        getChildList(caseId);
    })
    .catch(err => console.log(err));
}

// [ 블럭 생성 레이아웃 ] --------------------------------------------------------------------------------------
function addDbpage(){
    const addDBPageBtn = `
        <div class="caseTags add-page-div">
            <div class="inlineTags add-dbpage">&#10010;</div>
            <div class="inlineTags add-dbpage">새로 만들기</div>
        <div>
    `
    return addDBPageBtn;
}

function dblistBlock(block){
    let useAttr = getAttrList(block['attrList']);
    const listType = `
        <div draggable="true" data-block-id="`+block['block']['displayId']+`" 
            data-page-id="`+block['page']['pageId']+`" class="dbtype-list db_block" 
            data-page-order="`+block['page']['numbering']+`" data-block-order="`+block['block']['rowX']+`">
            <div class="inlineTags data_page"><span class="material-symbols-outlined">draft</span></div>
            <div class="inlineTags data_page data_pageNM">`+block['page']['pageName']+`</div>
            <div class="inlineTags del-db-page">&#10005;</div>
            <div class="attr-list inlineTags">`+useAttr+`</div>
        </div>
    `;
    return listType;
}

function dbBrdBlock(block){
    let useAttr = getAttrList(block['attrList']);
    const brdType = `
        <div draggable="true" data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" 
                class="dbtype-brd db_block" data-page-order="`+block['page']['numbering']+`" data-block-order="`+block['block']['rowX']+`">
            <div class="inlineTags data_page material-symbols-outlined">draft</div>
            <div class="inlineTags data_page data_pageNM">`+block['page']['pageName']+`</div>
            <div class="inlineTags del-db-page">&#10005;</div>
            <div>`+useAttr+`</div>
        </div>
    `;
    return brdType;
}

function dbGalBlock(block){
    let useAttr = getAttrList(block['attrList']);
    let backImg = ''
    block.attrList.forEach(attr => {
        if(attr.attrId == "IMG" && attr.attrContent != null){
            backImg = attr.attrContent;
        }
    })

    const galType = `
    <div draggable="true" data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" 
                class="dbtype-gal db_block" data-page-order="`+block['page']['numbering']+`" data-block-order="`+block['block']['rowX']+`">
        <div class="inlineTags del-db-page">&#10005;</div>
        <div class="gal-thumbnail" class="data_page">
            <img src="${backImg!=''?'/dbFiles/'+backImg:'images/dbimg/noimg.jpg'}">
        </div>
        <div>
            <div class="data_page data_pageNM"><span class="material-symbols-outlined">draft</span>`+block['page']['pageName']+`</div>
            <div>`+useAttr+`</div>
        </div>
    </div>
    `;
    return galType;
}

function dbTblBlock(block){
    let tr = document.createElement("div");
    tr.draggable = true;
    tr.setAttribute("data-block-id", block.block.displayId);
    tr.setAttribute("data-page-id", block.page.pageId);
    tr.setAttribute("data-block-order", block.block.rowX);
    tr.setAttribute("data-page-order", block.page.numbering);
    tr.classList.add("dbtype-tbl", "table-tr", "db_block", "data_page");
    let td = document.createElement("div");
    td.classList.add("data_page", "data_pageNM");
    td.textContent = block.page.pageName;
    tr.append(td);
    return tr;
}

// 테이블 레이아웃 - 속성 생성
function dbTblAttrBlock(attrs, uniqueList){
    // uniqueList : 중복없는 속성 리스트
    let divList = [];
    uniqueList.forEach(item=>{
        let td = document.createElement("div"); // attr-case
        td.setAttribute("data-duse-id", item.dbUseId);
        td.setAttribute("data-attrid", item.attrId);
        td.setAttribute("data-attr-order", item.numbering);
        td.classList.add("attr-case", (item.displayCheck=="TRUE"?"view-visible":"hide"));
        if(item.attrId=="USER" || item.attrId=="TAG") td.classList.add("attrs");
        attrs.forEach(attr => {
            if(attr.dbUseId != item.dbUseId) return;    // 같은 속성끼리 묶기 위한 조건
            let innerDiv;
            let content = attr.attrContent;     // 내용 처리
            if(attr.attrContent == null) content = '';
            if(['UUSER', 'CUSER', 'USER'].includes(attr.attrId)){
                content = content==''?'':`${attr.nickname}(${attr.attrContent})`;
                innerDiv = document.createElement("div");
            }
            // 속성별 레이아웃
            if(['TAG', 'USER'].includes(attr.attrId)){
                innerDiv = document.createElement("div");
                innerDiv.classList.add("attr");
                innerDiv.setAttribute("data-duse-id", attr.dbUseId);
                innerDiv.setAttribute("data-puse-id", attr.pageUseId);
                innerDiv.setAttribute("data-attrid", attr.attrId);
                innerDiv.setAttribute("data-attr-order", attr.numbering);
            }
            if(attr.attrId == 'CHECK'){
                innerDiv = document.createElement("input");
                innerDiv.type = "checkbox";
                innerDiv.classList.add("dbattr-check");
                if(attr.attrContent == 'TRUE') innerDiv.checked = true;
            }
            if(attr.attrId == 'URL'){
                innerDiv = document.createElement("a");
                if(content=='') innerDiv.classList.add("hide");
                innerDiv.classList.add("attrAtag");
                innerDiv.href = content;
            }
            if(attr.attrId == 'MEDIA'){
                innerDiv = document.createElement("div");
                let div = document.createElement("div");
                div.textContent = content == '' ? '' : content.substring(13);
                div.classList.add("attr", "inlineTags", "file-content");
                div.setAttribute("data-fileName", content);
                let btn = document.createElement("div");
                btn.classList.add("inlineTags", "del-attr-file");
                div.append(btn);
                let input = document.createElement("input");
                input.type="file";
                input.style.display = "none";
                input.classList.add("db-file-upload");
                innerDiv.append(div, input);
            }
            if(attr.attrId == 'IMG'){
                innerDiv = document.createElement("div");
                td.setAttribute("data-puse-id", attr.pageUseId);
                let img = document.createElement("img");
                img.width = 50;
                img.classList.add("attr", "inlineTags", "db-img");
                img.src = content == null || content == "" ?
                                    'images/dbimg/noimg.jpg' : '/dbFiles/'+content;
                let input = document.createElement("input");
                input.type = "file";
                input.style.display = "none";
                input.classList.add("db-img-upload");
                input.accept = "image/*";
                innerDiv.append(img, input);
            }
            if(['CAL', 'A_TEXT', 'NUM', 'STATE', 'CSUER', 'CDATE', 'UUSER', 'UDATE'].includes(attr.attrId)){
                innerDiv = document.createElement("div");
                td.setAttribute("data-puse-id", attr.pageUseId);
            }
            if(!['CHECK', 'IMG', 'MEDIA'].includes(attr.attrId)) innerDiv.textContent = content;
            innerDiv.setAttribute("data-duse-id", attr.dbUseId);
            innerDiv.setAttribute("data-puse-id", attr.pageUseId);
            innerDiv.setAttribute("data-attrid", attr.attrId);
            innerDiv.classList.add("attr");
            td.append(innerDiv);
        })
        divList.push(td);
    })
    return divList;
}