async function listLayoutEditor(pageList, pageId, layout){
    let dbbody = document.querySelector('[data-page-id="'+pageId+'"]');
    console.log(dbbody);
    // dbbody.setAttribute("data-layout", layout);
    //console.log(dbbody);
    //dbbody.innerHTML = "";
    //console.log("페이지아이디: " + pageId + ", 레이아웃 : " + layout);
    console.log(pageList);
    
    /*
    switch(layout){
        case 'DB_LIST' : 
            pageList.forEach(async(block) => {
                let dbInfo = await getDBPageInfo(block.displayId);            // displayId로 해당 page 정보 가져오기
                let makeBlock = dblistBlock(block, dbInfo);
                dbbody.insertAdjacentHTML("afterbegin", makeBlock);
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
            pageList.forEach(async(block) => {
                let dbInfo = await getDBPageInfo(block.displayId);
                    for(let field in dbInfo[1]){
                        if(dbInfo[1][field]['attrId'] == 'STATE' && dbInfo[1][field]['attrContent'] == state) {
                            let makeBlock = dbBrdBlock(block, dbInfo);      // return : 블럭 tag
                            stateTag.insertAdjacentHTML("afterbegin",makeBlock);
                        }
                    }  // 속성 for
                }); // pageList for
                let addpage = addDbpage();
                stateTag.insertAdjacentHTML("afterbegin", addpage);
                caseDiv.append(stateTag);
            }); //states for
            dbbody.append(caseDiv);
            break;

        case 'DB_GAL' : 
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
    };
    */
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
    	//console.log(result);
    })
    .catch(err => console.log(err));
}

//하위 page 조회(page info, use attr)
async function getDBPageInfo(diplayId){
    let data = {};
    await fetch("getDBPageInfo",{
        method : "post",
        body : diplayId,
    })
    .then(response => {
        return response.json();
    })
    .then(result => {
        data = result;
    })
    .catch(err => console.log(err))
    return data;
}

function addDBPage(e){
    console.log(e.currentTarget);
}

// 블럭 레이아웃들  ✔️block : blockVO, dbInfo[0] : PageVo, dbInfo[1] : useAttrVO
function getAttrList(attrs){
    let useAttr = '';
    for(let field in attrs){
        if (attrs[field]["displayCheck"] == "TRUE" && attrs[field]["attrId"] != "STATE"){
            useAttr += `
            <div data-page-attr="`+attrs[field]["attrId"]+`" data-attr-id="`+attrs[field]["useAttrId"]+`">
                `+attrs[field]["attrContent"]+`
            </div>
            `;
        }
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

function dblistBlock(block, dbInfo){
    let useAttr = getAttrList(dbInfo[1]);
    const listType = `
        <div data-block-id="`+block.displayId+`" data-page-id="`+dbInfo[0].pageId+`" data-dbtype="list">
        <div data-tagimg>img</div>
        <div data-pagename>`+dbInfo[0].pageName+`</div>
        <div class="listtype-attr">`+useAttr+`</div>
        </div>
    `;
    return listType;
}

function dbBrdBlock(block, dbInfo){
    let useAttr = getAttrList(dbInfo[1]);
    const brdType = `
        <div data-block-id="`+block.displayId+`" data-page-id="`+dbInfo[0].pageId+`" data-dbtype="brd">
            <div data-pagename>`+dbInfo[0].pageName+`</div>
            `+useAttr+`
        </div>
    `;
    return brdType;
}

function dbGalBlock(block, dbInfo){
    let useAttr = getAttrList(dbInfo[1]);
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

function dbTblBlock(block, dbInfo){
    let useAttr = getAttrList(dbInfo[1]);
    const galType = `
        <div data-block-id="`+block.displayId+`" data-page-id="`+dbInfo[0].pageId+`" data-dbtype="tbl">

        </div>
    `;
    return galType;
}

function dbCalBlock(){
    let useAttr = getAttrList(dbInfo[1]);
    const galType = `
        <div data-block-id="`+block.displayId+`" data-page-id="`+dbInfo[0].pageId+`" data-dbtype="cal">

        </div>
    `;
    return galType;
}