function listLayoutChange(layout){
    let listBody = document.getElementById("db-page-body");
    listBody.innerHTML = "";

    console.log(layout);
    switch(layout){
        case 'DB_LIST' : 
            pageList.forEach(async(block) => {
                let divBlock = document.createElement('div');
                divBlock.addEventListener("click", dbBlockClick);
                divBlock.setAttribute("id", block.displayId);
                divBlock.setAttribute("class", "db-layout layout-list");
                
                let divContent = document.createElement('div');
                let pageInfo = await getDBPageInfo(block.displayId);            // displayId로 해당 page 정보 가져오기
                divContent.textContent = pageInfo[0]['pageName'];
                divContent.setAttribute("data-dbpage-id", pageInfo[0]['pageId']);
                divBlock.append(divContent);
                listBody.append(divBlock);
            });
            break;

        case 'DB_BRD' : 
            stateType.forEach(state => {        // 상태에 따라 DIV 생성
                let brdDiv = document.createElement('div');
                brdDiv.setAttribute("id", "brd-case");
                brdDiv.setAttribute("class", state);
                let span = document.createElement('span');
                span.textContent = state;
                brdDiv.append(span);

                // 블럭 생성(조건문 : 상태값에 따라서 생성하기)
                pageList.forEach(async(block) => {
                    let pageInfo = await getDBPageInfo(block.displayId);
                    pageInfo[1].forEach(item => {
                        if(item["attrId"] == "STATE" && item["attrContent"] == state){
                            console.log(item["attrContent"]);
                            // 해당 상태에 들어가야할 블럭 내용
                            let divBlock = document.createElement('div');
                            divBlock.setAttribute("data-dbpage-id", pageInfo[0]['pageId']);
                            divBlock.setAttribute("class", "layout-brd");
                            let divContent = document.createElement('div');     // 페이지 이름
                            divContent.textContent = pageInfo[0]['pageName'];
                            divBlock.append(divContent);

                            brdDiv.append(divBlock);
                        }
                        // DISPLAY_CHECK 추가하기
                        if(item["displayCheck"] == "TRUE"){
                            let attrDiv = document.createElement('div');
                            attrDiv.textContent = item["attrContent"];
                            attrDiv.setAttribute("id", item["attrId"]);
                            let pageId = pageInfo[0]['pageId'];
                            let targetDiv = document.querySelector('div[data-dbpage-id="'+pageId+'"]');
                            console.log(targetDiv);
                            targetDiv.append(attrDiv);      // divBlock 찾아봐라
                        }
                    })
                })
                
                listBody.append(brdDiv);
            });
            break;

        case 'DB_CAL' :
            pageList.forEach(async(block) => {
                let divBlock = document.createElement('div');
                divBlock.addEventListener("click", dbBlockClick);
                divBlock.setAttribute("id", block.displayId);
                divBlock.setAttribute("class", "db-layout layout-cal");
            });
            break;

        case 'DB_GAL' :
            pageList.forEach(async(block) => {
                let divBlock = document.createElement('div');
                divBlock.addEventListener("click", dbBlockClick);
                divBlock.setAttribute("id", block.displayId);
            });
            break;

        case 'DB_TBL' :
            pageList.forEach(async(block) => {
                let divBlock = document.createElement('div');
                divBlock.addEventListener("click", dbBlockClick);
                divBlock.setAttribute("id", block.displayId);
                divBlock.setAttribute("class", "db-layout layout-tbl");

            });
            break;
    }
}

//db블럭 클릭시 발생하는 이벤트
function dbBlockClick(e){
    console.log(e.target);
}


//diplayId로 pageInfo 조회
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