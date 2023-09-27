async function listLayoutEditor(pageList, pageId, layout){
    let dbbody = document.querySelector('[data-page-id="'+pageId+'"]').children[1];
    dbbody.innerHTML = "";
    
    switch(layout){
        case 'DB_LIST' :
            dbbody.insertAdjacentHTML("afterbegin", addDbpage()); 
            pageList.forEach(block => {
                if(block['page']['deleteCheck'] == 'TRUE') return;
                let blockTag = dblistBlock(block);
                // let attrTags = getAttrList(block['attrList']);
                dbbody.insertAdjacentHTML("afterbegin", blockTag);
            });

            let attrList = document.querySelectorAll('.attr-list');     //속성 레이아웃용
            attrList.forEach(ele => {
                ele.querySelectorAll('div').forEach(tag => {
                    tag.setAttribute("class", "inlineTags");
                })
            })
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
            stateTag.insertAdjacentHTML("afterbegin", addDbpage());
            pageList.forEach(info => {
                if(info['page']['deleteCheck'] == 'TRUE') return;
                info.attrList.forEach(attr => {
                    if(attr.attrId == "STATE" && attr.attrContent == state){
                        let blockTag = dbBrdBlock(info);
                        stateTag.insertAdjacentHTML("afterbegin", blockTag);
                    }
                })
            })
            
            caseDiv.append(stateTag);
        })
            dbbody.append(caseDiv);
            break;

        case 'DB_GAL' : 
            dbbody.insertAdjacentHTML("afterbegin", addDbpage());
            pageList.forEach(block => {
                if(block['page']['deleteCheck'] == 'TRUE') return;
                let blockTag = dbGalBlock(block);
                dbbody.insertAdjacentHTML("afterbegin", blockTag);
            });

            break;

        case 'DB_TBL' :
            /*
               pageList.length + 1 => tr(col)
               MAX(pageList['attrList'].length) + 1 => td(row)
            */
            let col = pageList.length + 1;
            let row = 1;
            console.log(pageList)
            pageList.forEach(block => {
                if(row < block['attrList'].length + 1) row = block['attrList'].length + 1;
            })

            let table = document.createElement('div');
            table.setAttribute("class", "dbtype-table");
            for(let i=0; i<col; i++){   //i=col
                let tr = document.createElement('div');
                if(i != 0){
                    let block = pageList[i-1];
                    tr.setAttribute("data-block-id", block['block']['blockId']);
                    tr.setAttribute("data-page-id", block['page']['pageId']);                    
                    tr.setAttribute("data-block-order", block['block']['rowX']);
                    tr.setAttribute("class", "dbtype-tbl prodoc_block");
                }
                tr.setAttribute("class", "table-tr");
                for(let j=0; j<row; j++){   //j=row
                    let td = document.createElement('div');
                    td.setAttribute("class", "table-td");
                    if( i == 0 && j == 0){
                        td.textContent = '이름';
                        let className = tr.getAttribute("class");
                        tr.setAttribute("class", className + " table-thead");
                    } else if( i == 0 && j > 0){
                        // db에 사용된 속성이름 넘버링순
                        let attr = pageList[i]['attrList'][j-1];
                        let displayOption = "view";
                        if(attr['displayCheck'] == "FALSE") displayOption = "hide";
                        td.textContent = attr['attrName'];
                        td.setAttribute("contenteditable", "true");
                        td.setAttribute("class", displayOption);
                    } else if( i > 0 && j == 0 ){
                        // 하위페이지 넘버링순
                        let page = pageList[i-1]['page'];
                        let pageTag = document.createElement("div");
                        pageTag.textContent = page['pageName'];
                        pageTag.setAttribute("class", "inlineTags");
                        let delTag = document.createElement("div");
                        delTag.setAttribute("class", "inlineTags del-db-page");
                        delTag.innerHTML = "&#10005;";
                        td.append(pageTag);
                        td.append(delTag);
                    } else {
                        // 해당 페이지 속성 | i-1 = 페이지순서, j-1 = 속성순서
                        // 가장 위의 tr과 동일한 dbUdeId를 사용하는 아이를 가지고 와야 한다.
                        let attrDiv = document.createElement("div");
                        let attr = pageList[i-1]['attrList'][j-1];
                        let displayOption = "view";
                        let content = attr['attrContent'];
                        if(attr['attrId'] == 'CUSER' || attr['attrId'] == 'UUSER') content = attr['nickname'] + '(' + content + ')';
                        if(attr['displayCheck'] == "FALSE") displayOption = "hide";
                        td.setAttribute("class", displayOption);
                        attrDiv.textContent = content;
                        attrDiv.setAttribute("data-duse-id", attr['dbUseId']);
                        attrDiv.setAttribute("data-puse-id", attr['pageUseId']);
                        attrDiv.setAttribute("data-attrid", attr['attrId']);
                        attrDiv.setAttribute("data-attr-order", attr['numbering']);
                        attrDiv.setAttribute("class", "attr " + displayOption);
                        attrDiv.setAttribute("contenteditable", "true");
                        td.append(attrDiv);
                    }
                    tr.append(td);
                }
                table.append(tr);
            }
            let crePage = document.createElement("div");
            crePage.setAttribute("class", "caseTags table-tr add-dbpage");
            crePage.innerHTML = "&#10010; 새로 만들기";
            table.append(crePage);
            dbbody.append(table);

            document.querySelectorAll(".table-thead").forEach( tr => {
                let addAttr = document.createElement("div");
                addAttr.setAttribute("class", "inlineTags add-page-attr");
                addAttr.innerHTML = "&#10010;";
                tr.append(addAttr);
                console.log(tr);
            })
            break;
            
            /*
        case 'DB_CAL' : 
            dbbody.insertAdjacentHTML("afterbegin", addDbpage());
            break;
            */
    };
    
}

function updateCase(pageId, layout){
    fetch("updateCase",{
        method : "post",
        body : JSON.stringify({"pageId" : pageId, "caseId" : layout}),
        headers : {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
    	console.log(result.result.displayId);
        let caseId = result.result.displayId;
        getChildList(caseId);
    })
    .catch(err => console.log(err));
}

// [ 블럭 생성 레이아웃 ] --------------------------------------------------------------------------------------
function getAttrList(attrs){    // 속성
    let useAttr = '';
    let displayOption = 'view';

    for(let info in attrs){
        let content = attrs[info]['attrContent'];
        if (content == null || content == "") continue;
        if (attrs[info]['attrId'] == 'CUSER' || attrs[info]['attrId'] == 'UUSER') content = attrs[info]['nickname'] + '(' + content + ')';
        if(attrs[info]['displayCheck'] == "FALSE") displayOption = 'hide';
        else displayOption = 'view';
        useAttr += `
        <div data-duse-id="`+attrs[info]['dbUseId']+`" data-puse-id="`+attrs[info]['pageUseId']+`" data-attrid="`+attrs[info]['attrId']+`" class="`+displayOption+`" data-attr-order="`+attrs[info]['numbering']+`">
            <span class="attr">`+content+`</span>
        </div>
        `
    }
    return useAttr;
}

function addDbpage(){
    const addDBPageBtn = `
        <div class="caseTags">
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
    const galType = `
    <div data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" class="dbtype-gal prodoc_block"  data-block-order="`+ block['block']['rowX'] +`">
        <div class="inlineTags del-db-page">&#10005;</div>
        <div class="gal-thumbnail">이미지 추가</div>
        <div>
            <div>`+block['page']['pageName']+`</div>
            <div>`+useAttr+`</div>
        </div>
    </div>
    `;
    return galType;
}

function dbTblBlock(block){
    let useAttr = getAttrList(block['attrList']);
    console.log(block['attrList'].length);
    
    const galType = `
    <div data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" class="dbtype-tbl prodoc_block"  data-block-order="`+ block['block']['rowX'] +`">

    </div>
    `;
    // return galType;
}

function dbCalBlock(block){
    let useAttr = getAttrList(block['attrList']);
    const galType = `
        <div data-block-id="`+block.displayId+`" data-page-id="`+dbInfo[0].pageId+`" data-dbtype="cal">

        </div>
    `;
    return galType;
}