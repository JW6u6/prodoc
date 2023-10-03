async function listLayoutEditor(dataList, pageId, layout){
    let dbbody = document.querySelector('[data-page-id="'+pageId+'"]').children[2];
    dbbody.innerHTML = "";
    
    let pageList = [];  // 삭제되지 않은 페이지 목록
    dataList.forEach(item => {
        if (item['page']['deleteCheck'] == 'FALSE') pageList.push(item);
    });


    switch(layout){
        case 'DB_LIST' :
            dbbody.insertAdjacentHTML("afterbegin", addDbpage()); 
            pageList.forEach(block => {
                let blockTag = dblistBlock(block);
                dbbody.insertAdjacentHTML("afterbegin", blockTag);
            });

            let attrList = document.querySelectorAll('.attr-list');     //속성 레이아웃용
            attrList.forEach(ele => {
                ele.querySelectorAll('div').forEach(tag => {
                    tag.classList.add("inlineTags");
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
                let blockTag = dbGalBlock(block);
                dbbody.insertAdjacentHTML("afterbegin", blockTag);
            });
            break;

        case 'DB_TBL' :
            /*
               pageList.length + 1 => tr(row)
               MAX(pageList['attrList'].length) + 1 => td(col)
            */
               let row = pageList.length + 1;
               let col = 1;
               pageList.forEach(block => {
                   if(col < block['attrList'].length + 1) col = block['attrList'].length + 1;
               })
               for(let i=0; i<row; i++){   // 페이지 수+1 만큼 행 생성
                   let tr = document.createElement('div');
                   if(i != 0){
                       let block = pageList[i-1];
                       tr.setAttribute("data-block-id", block['block']['blockId']);
                       tr.setAttribute("data-page-id", block['page']['pageId']);                    
                       tr.setAttribute("data-block-order", block['block']['rowX']);
                       tr.setAttribute("class", "dbtype-tbl prodoc_block");
                   }
                   tr.setAttribute("class", "table-tr");
                   for(let j=0; j<col; j++){   // 속성수 + 1만큼 열 생성
                       let td = document.createElement('div');
                       td.setAttribute("class", "table-td");
                       if( i == 0 && j == 0){
                           td.textContent = '이름';
                           let className = tr.getAttribute("class");
                           tr.setAttribute("class", className + " table-thead");
                       } else if( i == 0 && j > 0){
                           // db에 사용된 속성이름 넘버링순
                           let attr = pageList[i]['attrList'][j-1];
                           let displayOption = "view-visible";
                           if(attr['displayCheck'] == "FALSE") displayOption = "hide";
                           td.textContent = attr['attrName'];
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
                           let displayOption = "view-visible";
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
                dbbody.append(tr);
               }
               let crePage = document.createElement("div");
               crePage.setAttribute("class", "caseTags table-tr add-dbpage add-page-div");
               crePage.innerHTML = "&#10010; 새로 만들기";
               dbbody.append(crePage);
   
               document.querySelectorAll(".table-thead").forEach( tr => {
                   if( tr.querySelector(".add-page-attr") != null ) return; // 재생성 방지
                   let addAttr = document.createElement("div");
                   addAttr.setAttribute("class", "inlineTags add-page-attr");
                   addAttr.innerHTML = "&#10010;";
                   tr.append(addAttr);
               })
               break;
            
        case 'DB_CAL' : 
            let caseId = dbbody.getAttribute("data-block-id");
            let date = new Date();
            createCalendar(dbbody, date);   // 캘린더 생성
            pageList.forEach(block => {     // 생성된 캘린더에 데이터 추가하기
                block.attrList.forEach(attr=>{
                    if(attr.attrId == "CAL" && attr.attrName == "날짜" && attr.attrContent != null){
                        let blockDiv = dbCalBlock(block);
                        let selector = '[data-cal-date="' + attr.attrContent + '"]';
                        let targetDiv = dbbody.querySelector(selector);
                        // 해당 div에 block 추가하기
                    }
                })
            })
            break;
    };
    
}

const nowDateList = [];     // 캘린더 형성시 현재 날짜에 대한 정보를 저장하기 위한 배열

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
        let caseId = result.result.displayId;
        getChildList(caseId);
    })
    .catch(err => console.log(err));
}

// [ 블럭 생성 레이아웃 ] --------------------------------------------------------------------------------------
function getAttrList(attrs){    // 속성
    let useAttr = '';
    let displayOption = 'view-visible';

    for(let info in attrs){
        let content = attrs[info]['attrContent'];
        if (content == null || content == "") continue;
        if (attrs[info]['attrId'] == 'CUSER' || attrs[info]['attrId'] == 'UUSER') content = attrs[info]['nickname'] + '(' + content + ')';
        if (attrs[info]['displayCheck'] == "FALSE") displayOption = 'hide';
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
    let galType = `
    <div data-block-id="`+block['block']['displayId']+`" data-page-id="`+block['page']['pageId']+`" class="dbtype-tbl table-tr prodoc_block"  data-block-order="`+ block['block']['rowX'] +`">
        <div class="table-td">
            <div class="inlineTags">${block.page.pageName}</div>
            <div class="inlineTags del-db-page">✕</div>
        </div>
    `;
    block.attrList.forEach(attr => {
        galType += `
        <div class=${attr.displayCheck == 'TRUE'? "view-visible inlineTags" : "hide"}>
            <div class=${attr.displayCheck == 'TRUE'? "attr view-visible" : "attr hide"} data-duse-id="${attr.dbUseId}" data-puse-id="${attr.pageUseId}" data-attrid="${attr.attrId}" data-attr-order="${attr.numbering}">
                ${attr.attrContent}
            </div>
        </div>
        `;
    })
    galType += `</div>`;
    return galType;
}

function dbCalBlock(block){
    let useAttr = getAttrList(block['attrList']);
    const galType = `
    <div data-block-id="${block.block.displayId}" data-page-id="${block.page.pageId}" class="dbtype-cal prodoc_block"  data-block-order="${block.block.rowX}">
        <div>${block.page.pageName}</div>
        <div>${useAttr}</div>
    </div>
    `;
    return galType;
}

function createCalendar(dbbody, date){
    dbbody.innerHTML = "";
    let caseId = dbbody.parentNode.getAttribute('data-block-id');
    let dbCalendar = document.createElement('div'); // 캘린더 DOM
    now = new Date(date);
    let today = {
        "year" : now.getFullYear(), //년
        "date" : now.getDate(),     //일
        "month" : now.getMonth(),   // +1 = 현재 다
        "day" : now.getDay()        //요일(월=1)
    };
    let calHead = document.createElement('div');
    let dateTitle = document.createElement('div');
    dateTitle.textContent = `${today.year}년 ${today.month + 1}월`;
    calHead.append(dateTitle);
    dbCalendar.append(calHead);
    dbbody.append(dbCalendar);

    let calOp = document.createElement('div');
    let prevBt = document.createElement('button');
    prevBt.addEventListener("click", changeMonth);
    prevBt.setAttribute("class", "prevMonth");
    let nowBt = document.createElement('button');
    nowBt.addEventListener("click", changeMonth);
    nowBt.setAttribute("class", "nowMonth");
    let nextBt = document.createElement('button');
    nextBt.addEventListener("click", changeMonth);
    nextBt.setAttribute("class", "nextMonth");
    prevBt.textContent = '<';
    nowBt.textContent = 'now';
    nextBt.textContent = '>';
    calOp.append(prevBt, nowBt, nextBt);
    calHead.append(calOp);
    
    let prevLast = new Date(today.year, today.month, 0);    //전달 마지막 Date
    let thisLast = new Date(today.year, today.month + 1, 0)  //이번달 마지막 Date
    let preMonDate = prevLast.getDate();    //지난달 마지막 날짜(숫자)
    let preMonDay = prevLast.getDay();      //지난달 마지막 요일
    let nowMonDate = thisLast.getDate();    //이번달 마지막 날짜(숫자)
    let nowMonDay = thisLast.getDay();      //이번달 마지막 요일
    let preDates = [];
    /* 
        이번달의 마지막일의 크기(n+1)를 가진 배열을 생성
        -> keys()로 0 ~ 크기-1 까지의 iterator 생성
        -> slice로 0 제거하여 이번달 1~말일 정보를 가짐
    */
        let thisDates = [...Array(nowMonDate+1).keys()].slice(1);
        let nextDates = [];

        if(preMonDay != 6){
            for(let i=0; i<preMonDay + 1; i++){
                preDates.unshift(preMonDate - i);
            }
        }
        for(let i=1; i<7-nowMonDay; i++){
            nextDates.push(i);
        }

        let calDate = preDates.concat(thisDates, nextDates);
        let totalWeek = Math.ceil(calDate.length/7);    // 이번달 주

        for(i=0; i<totalWeek; i++){
            let colDiv = document.createElement('div');
            colDiv.setAttribute("class", "cal-row display-flex");
            calDate.forEach((date, j) =>{
                let min = i*7;
                if( min <= j && j < min + 7 ){
                    // 날짜 입력용 padStart(2, '0')
                    let thisMonth = (today.month+1).toString().padStart(2, '0');
                    let thisDate = date.toString().padStart(2, '0');

                    let dateDiv = document.createElement('div');
                    dateDiv.textContent = date;
                    dateDiv.setAttribute("class", "cal-date");
                    dateDiv.setAttribute("data-cal-date", `${today.year}/${thisMonth}/${thisDate}`);
                    let addDate = document.createElement('button');
                    addDate.textContent = '+';
                    addDate.setAttribute("class", "add-dbpage");
                    // addDate.setAttribute("style", "visibility : hidden");
                    dateDiv.append(addDate);
                    colDiv.append(dateDiv);
                }
            })
            dbCalendar.append(colDiv);
        }

        // nowDateList.push(dateData); //날짜 변경 이벤트를 위해 리스트에 현재 값 저장
        let dateData = {};
        dateData[caseId] = now;
        nowDateList.forEach((item, i) => {
            for(let field in item){
                if(field == caseId) nowDateList[i] = dateData;
                else nowDateList.push(dateData);
            }
        })
        if(nowDateList.length == 0) nowDateList.push(dateData);
        console.log(nowDateList);
}

function prevMonth(e){
    let prevDate = new Date();
    let caseDiv = e.target.closest('[data-layout]');
    let caseId = caseDiv.getAttribute('data-block-id');
    console.log(caseId);
    nowDateList.forEach(item => {
        for(let field in item){
            if(field == caseId) prevDate = new Date(item[field].getFullYear(), item[field].getMonth()-1, 1);
        }
    })
    console.log(prevDate);
    let dbbody = caseDiv.querySelector('.db-block-body');
    createCalendar(dbbody, prevDate);
}

function changeMonth(e){
    let selectDate = new Date();
    let caseDiv = e.target.closest('[data-layout]');
    let caseId = caseDiv.getAttribute('data-block-id');
    console.log(caseId);
    nowDateList.forEach(item => {
        for(let field in item){
            if(field == caseId){
                let targetClass = e.currentTarget.getAttribute("class");
                if(targetClass == "prevMonth")selectDate = new Date(item[field].getFullYear(), item[field].getMonth()-1, 1);
                else if(targetClass == "nowMonth")selectDate = new Date();
                else if(targetClass == "nextMonth")selectDate = new Date(item[field].getFullYear(), item[field].getMonth()+1, 1);
            }
        }
    })
    let dbbody = caseDiv.querySelector('.db-block-body');
    createCalendar(dbbody, selectDate);
}