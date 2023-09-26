async function listLayoutEditor(pageList, pageId, layout){
    let dbbody = document.querySelector('[data-page-id="'+pageId+'"]').children[1];
    dbbody.innerHTML = "";
    console.log("페이지아이디: " + pageId + ", 레이아웃 : " + layout);
    // 속성에 매핑하기 위한 tbl_db_attr 불러오기
    
    switch(layout){
        case 'DB_LIST' : 
            pageList.forEach(block => {
                console.log(block);
                let blockTag = dblistBlock(block);
                // let attrTags = getAttrList(block['attrList']);
                dbbody.insertAdjacentHTML("afterbegin", blockTag);
            });

            dbbody.insertAdjacentHTML("afterbegin", addDbpage());
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
                        stateTag.insertAdjacentHTML("afterbegin", blockTag);
                    }
                })
            })
            stateTag.insertAdjacentHTML("afterbegin", addDbpage());
            caseDiv.append(stateTag);
        })
            dbbody.append(caseDiv);
            break;

/*         case 'DB_GAL' : 
            pageList.forEach(async(block) => {
                let dbInfo = await getDBPageInfo(block.displayId);            // displayId로 해당 page 정보 가져오기
                let makeBlock = dbGalBlock(block, dbInfo);
                dbbody.insertAdjacentHTML("afterbegin", makeBlock);
            });

            let add = addDbpage();
            dbbody.insertAdjacentHTML("afterbegin", addDbpage());
            break;

        case 'DB_TBL' : 
            dbbody.insertAdjacentHTML("afterbegin", addDbpage());
            break;

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
    	console.log(result);
    })
    .catch(err => console.log(err));
}

// [ 블럭 생성 레이아웃 ] --------------------------------------------------------------------------------------
function getAttrList(attrs){    // 속성
    let useAttr = '';
    let displayOption = 'view';

    for(let info in attrs){
        if(attrs[info]['displayCheck'] == "FALSE") displayOption = 'hide';
        else displayOption = 'view';
        useAttr += `
        <div data-duse-id="`+attrs[info]['dbUseId']+`" data-puse-id="`+attrs[info]['pageUseId']+`" class="`+displayOption+`">
            <span>`+attrs[info]['attrContent']+`</span>
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
        <div data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" class="dbtype-list prodoc_block">
            <div data-tagimg>📄</div>
            <div data-pagename>`+block['page']['pageName']+`</div>
            <div class="attr attr-list">`+useAttr+`</div>
        </div>
    `;
    return listType;
}

function dbBrdBlock(block){
    let useAttr = getAttrList(block['attrList']);
    const brdType = `
        <div data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" class="dbtype-list prodoc_block">
            <div data-pagename>`+block['page']['pageName']+`</div>
            `+useAttr+`
        </div>
    `;
    return brdType;
}

function dbGalBlock(block){
    let useAttr = getAttrList(block['attrList']);
    const galType = `
        <div data-block-id="`+block.displayId+`" data-page-id="`+dbInfo[0].pageId+`" data-dbtype="gal">
            <div data-gal-img=""><img scr=""></div>
            <div>
                <div data-pagename>`+dbInfo[0].pageName+`</div>
                `+useAttr+`
            </div>
        </div>
    `;
    return galType;
}

function dbTblBlock(block){
    let useAttr = getAttrList(block['attrList']);
    const galType = `
        <div data-block-id="`+block.displayId+`" data-page-id="`+dbInfo[0].pageId+`" data-dbtype="tbl">

        </div>
    `;
    return galType;
}

function dbCalBlock(){
    let useAttr = getAttrList(block['attrList']);
    const galType = `
        <div data-block-id="`+block.displayId+`" data-page-id="`+dbInfo[0].pageId+`" data-dbtype="cal">

        </div>
    `;
    return galType;
}