function listLayoutChange(pageId, layout){
    let dbbody = document.querySelector('[data-page-id="'+pageId+'"]').children[1];
    console.log(dbbody);
    dbbody.innerHTML = "";
    console.log("페이지아이디: " + pageId + ", 레이아웃 : " + layout);
    // case_id 업데이트 fetch
    updateCase(pageId, layout);

    switch(layout){
        case 'DB_LIST' : 
            pageList.forEach(async(block) => {
                let dbInfo = await getDBPageInfo(block.displayId);            // displayId로 해당 page 정보 가져오기
                let makeBlock = dblistBlock(block, dbInfo);
                dbbody.insertAdjacentHTML("afterbegin", makeBlock);
            });
            break;

        case 'DB_BRD' : 
            pageList.forEach(async(block) => {
                let dbInfo = await getDBPageInfo(block.displayId);
                let makeBlock = dbBrdBlock(block, dbInfo);
            })
            break;

        case 'DB_GAL' : 
            break;

        case 'DB_TBL' : 
            break;

        case 'DB_CAL' : 
            break;
    };

    let addPage = document.createElement("div");
    addPage.textContent = '새로 만들기';
    addPage.addEventListener("click", addPage);
    dbbody.append(addPage);
}

function updateCase(pageId, layout){
    fetch("updateCase",{
        method : "post",
        body : JSON.stringify({"pageId" : pageId, "caseId" : layout}),
        headers : {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        // console.log(response)
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

function addPage(e){
    console.log(e.currentTarget);
}

// 블럭 레이아웃들      ✔️block : blockVO, dbInfo[0] : PageVo, dbInfo[1] : useAttrVO
function dblistBlock(block, dbInfo){
    const listType = `
        <div data-block-id="`+block.displayId+`" data-page-id="`+dbInfo[0].pageId+`">
        <div>img</div>
        <div>`+dbInfo[0].pageName+`</div>
        </div>
    `;
    return listType;
}

function dbBrdBlock(block, dbInfo){
    const brdType = `
    
    `;
    return brdType;
}