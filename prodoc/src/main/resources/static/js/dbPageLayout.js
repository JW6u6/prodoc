async function listLayoutEditor(dataList, pageId, layout){
    let dbbody = document.querySelector('[data-page-id="'+pageId+'"]').children[2];
    dbbody.innerHTML = "";
    let pageList = [];  // 삭제되지 않은 페이지 목록  
    dataList.forEach(item => {
        if (item['page']['deleteCheck'] == 'FALSE') pageList.push(item);
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
        let states = ["WAIT", "RUN", "END", "CANCLE"];

        let statesTag = document.createElement("div");
        states.forEach(state => {
            let stateType = document.createElement("div");
            stateType.textContent = state;
            stateType.setAttribute("data-state-tags", state);
            statesTag.append(stateType);
        })
        dbbody.append(statesTag);

        let caseDiv = document.createElement("div");
        caseDiv.setAttribute("class", "display-flex");
        states.forEach(state => {
            let stateTag = document.createElement("div");
            stateTag.setAttribute("data-state", state);
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
            dbbody.insertAdjacentHTML("afterbegin", addDbpage());
            pageList.forEach(block => {
                let blockTag = dbGalBlock(block);
                dbbody.insertAdjacentHTML("afterbegin", blockTag);
            });
            break;

        case 'DB_TBL' :
            let uniqueAttr = [];
            let getAttr = {};
            for(let attr of pageList[0].attrList){
                let dui = attr.dbUseId;
                if(!getAttr[dui]){  // getAttr[dui]이 null 또는 undefined인지 체크
                    uniqueAttr.push(attr);
                    getAttr[dui] = true;
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

            break;
    };
    
}

const nowDateList = [];     // 캘린더 형성시 현재 날짜에 대한 정보를 저장하기 위한 배열

function updateCase(pageId, layout){
    let data = {"pageId" : pageId, "caseId" : layout};
    // data['creUser'] = document.getElementById("UserInfoMod").querySelector(".email").textContent;
    data['creUser'] = 'user1@user1' // ⭐⭐
    data['workId'] = 'TESTWORK'     // ⭐⭐ 추가하기


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
        <div data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" class="dbtype-list prodoc_block"  data-block-order="`+ block['block']['rowX'] +`">
            <div class="inlineTags">📄</div>
            <div class="inlineTags">`+block['page']['pageName']+`</div>
            <div class="inlineTags del-db-page">&#10005;</div>
            <div class="attr-list inlineTags">`+useAttr+`</div>
        </div>
    `;
    return listType;
}

function dbBrdBlock(block){
    let useAttr = getAttrList(block['attrList']);
    const brdType = `
        <div data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" class="dbtype-brd prodoc_block"  data-block-order="`+ block['block']['rowX'] +`">
            <div class="inlineTags">`+block['page']['pageName']+`</div>
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
    <div data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" class="dbtype-gal prodoc_block"  data-block-order="`+ block['block']['rowX'] +`">
        <div class="inlineTags del-db-page">&#10005;</div>
        <div class="gal-thumbnail"><img src="${backImg!=''?backImg:'images/dbimg/noimg.jpg'}" width="100%" height="100%"></div>
        <div>
            <div>`+block['page']['pageName']+`</div>
            <div>`+useAttr+`</div>
        </div>
    </div>
    `;
    return galType;
}

function dbTblBlock(block){
    let tr = document.createElement("div");
    tr.setAttribute("data-block-id", block.block.displayId);
    tr.setAttribute("data-page-id", block.page.pageId);
    tr.setAttribute("data-block-order", block.block.rowX);
    tr.classList.add("dbtype-tbl", "table-tr", "prodoc_block")
    let td = document.createElement("div");
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
            if(attr.dbUseId != item.dbUseId) return;
            let innerDiv = document.createElement("div");
            innerDiv.textContent = attr.attrContent == null ? '' : attr.attrContent;
            innerDiv.setAttribute("data-duse-id", attr.dbUseId);
            innerDiv.setAttribute("data-puse-id", attr.pageUseId);
            innerDiv.setAttribute("data-attrid", attr.attrId);
            innerDiv.classList.add("attr")
            td.append(innerDiv);
        })
        divList.push(td);
    })
    return divList;
}