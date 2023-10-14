function dbMoveEvent(type){
    // 칸반보드 빈값일때 이벤트
    const dbStateBoxs = document.querySelectorAll(".db-state-box");
    dbStateBoxs.forEach(box=>{
        // 박스에 드랍처리
        box.addEventListener("drop",(e)=>{
            const dragDBblock = document.querySelector(".dragging");
            e.currentTarget.prepend(dragDBblock);
        })
    })

    // 표 속성이름 드래그 이벤트
    const dbAttrNames = document.querySelectorAll(".attr-name");
    dbAttrNames.forEach(dbAttrName=>{
        dbAttrName.addEventListener("drop",(e)=>{
            e.stopPropagation();
            // 움직이는 블럭들을 정의
            const dragDBblock = document.querySelector(".dragging");
            const targetDBblcok = e.currentTarget;

            if(!(dragDBblock.classList.contains("attr-name"))) return;
            console.log("데이터베이스 표에서 속성 드랍이벤트");


            // 마우스 위치관련 변수 정의
            const targetWidth = targetDBblcok.offsetWidth;
            const targetVerticalCenter = targetWidth / 2;
            const rect = targetDBblcok.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;

            const dragDuseId = dragDBblock.dataset.duseId;
            const targetDuseId = targetDBblcok.dataset.duseId;

            // 데이터베이스 블럭 레이아웃 : 표일때 속성 이동에 관련된 코드
            // 속성값 이동을 위한 쿼리셀렉터
            const dragAttrContents = document.querySelectorAll(`[data-duse-id="${dragDuseId}"]:not(.attr-name):not(.attr)`);
            const targetAttrContents = document.querySelectorAll(`[data-duse-id="${targetDuseId}"]:not(.attr-name):not(.attr)`);

            //속성이름이동 (동시에 속성값도)
            if(targetVerticalCenter > offsetX){
                targetDBblcok.parentElement.insertBefore(dragDBblock, targetDBblcok);
                console.log("왼쪽 드랍 발생");
                // 드래그content를 하나하나 처리
                dragAttrContents.forEach((dragAttrContent,index) =>{
                    dragAttrContent.parentElement.insertBefore(dragAttrContent,targetAttrContents[index]);
                })
            } else {
                insertAfter(dragDBblock,targetDBblcok);
                console.log("오른쪽 드랍 발생")
                // 드래그content를 하나하나 처리
                dragAttrContents.forEach((dragAttrContent,index) =>{
                    insertAfter(dragAttrContent,targetAttrContents[index])
                })
            }
            AttrNumberingUpdate(dragDBblock);

        })
        dbAttrName.addEventListener("dragover",(e)=>{
            //기본적으로 해야할 것
            //이거 안하면 드랍안됨
            e.stopPropagation();
            e.preventDefault()
        })
        //드래그를 시작했을때
        dbAttrName.addEventListener("dragstart",(e)=>{
            e.stopPropagation();
            e.currentTarget.classList.add("dragging")
            console.log("드래그 시작:",e.currentTarget)
        })
        //드래그를 종료했을때
        dbAttrName.addEventListener("dragend",(e)=>{
            e.stopPropagation();
            e.currentTarget.classList.remove("dragging")
            console.log("드래그 종료",e.currentTarget);
            AttrNumberingUpdate(e.currentTarget);
        })

    })

    // 그 외의 데이터베이스 드래그 이벤트
    const dbBlock = document.querySelectorAll(".db_block");
    dbBlock.forEach(item=>{
        item.addEventListener("drop",(e)=>{
            e.stopPropagation(); // container의 drop 이벤트를 막기위함
            const dragDBblock = document.querySelector(".dragging");
            const targetDBblcok = e.currentTarget;

            if(!(dragDBblock.classList.contains("db_block"))) return;
            console.log("데이터베이스 드랍이벤트");

            
            
            // 크기 정의
            const targetWidth = targetDBblcok.offsetWidth;
            const targetHeight = targetDBblcok.offsetHeight;

            //가로
            const targetHorizonCenter = targetHeight / 2;
            //세로
            const targetVerticalCenter = targetWidth / 2;
            const rect = targetDBblcok.getBoundingClientRect();
            
            //부모 위치
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            // 갤러리일때는 가로 드래그, 그 외에는 세로 드래그
            if(type==="DB_GAL"){
                // 갤러리일때
                if(targetVerticalCenter > offsetX){
                    console.log("갤러리 왼쪽 드랍 발생");
                    targetDBblcok.parentElement.insertBefore(dragDBblock, targetDBblcok);
                } else {
                    insertAfter(dragDBblock,targetDBblcok);
                    console.log("갤러리 오른쪽 드랍 발생")
                }
            } else {
                // 갤러리가 아닐때
                if(targetHorizonCenter > offsetY){
                    console.log("위쪽드랍 발생");
                    targetDBblcok.parentElement.insertBefore(dragDBblock, targetDBblcok);
                } else {
                    insertAfter(dragDBblock,targetDBblcok);
                    console.log("아래쪽 드랍 발생")
                }
            }
        })
        item.addEventListener("dragover",(e)=>{
            //기본적으로 해야할 것
            //이거 안하면 드랍안됨
            e.stopPropagation();
            e.preventDefault()
        })
        //드래그를 시작했을때
        item.addEventListener("dragstart",(e)=>{
            e.stopPropagation();
            e.currentTarget.classList.add("dragging")
            console.log("드래그 시작:",e.currentTarget)
        })
        //드래그를 종료했을때
        item.addEventListener("dragend",(e)=>{
            e.stopPropagation();
            e.currentTarget.classList.remove("dragging")
            console.log("드래그 종료",e.currentTarget);
            dbNumberingUpdate(e.currentTarget);
        })
    })
    // item forEach문 종료
}

// 데이터베이스 하위페이지 속성에 드래그 이벤트 등록
function datapageMove(){
    const attrTags = document.querySelectorAll(".attr-name");
    attrTags.forEach( tag => {
        tag.addEventListener("drop", e => {
            e.stopPropagation(); // container의 drop 이벤트를 막기위함
            const dragDBblock = document.querySelector(".dragging").parentElement;
            const targetDBblcok = e.currentTarget.parentElement;

            if(!(dragDBblock.querySelector(".attr-name"))) return;
            console.log("데이터베이스 하위 페이지 드랍이벤트");
            
            // 크기 정의
            const targetHeight = targetDBblcok.offsetHeight;

            //가로
            const targetHorizonCenter = targetHeight / 2;
            const rect = targetDBblcok.getBoundingClientRect();
            
            //부모 위치
            const offsetY = e.clientY - rect.top;

            //모달로 연 페이지에서 이동했을 때 모달 밖의 데이터베이스 블럭에도 화면 업데이트
            //조건 : dui로 체크하고 page-attr을 가지지 않은 element
            const moveDui = document.querySelector(".dragging").getAttribute("data-duse-id");
            const moveInnerAttr = document.querySelector(`[data-duse-id="${moveDui}"]:not(.page-attr)`);    // 드래그블럭과 같은 dui
            const targetDui = e.currentTarget.getAttribute("data-duse-id");
            const targetInnerAttr = document.querySelector(`[data-duse-id="${targetDui}"]:not(.page-attr)`);  // 타겟블럭과 같은 dui
            if(targetHorizonCenter > offsetY){
                console.log("db하위페이지에서 위쪽드랍 발생");
                targetDBblcok.parentElement.insertBefore(dragDBblock, targetDBblcok);
                targetInnerAttr.parentElement.insertBefore(moveInnerAttr, targetInnerAttr);
            } else {
                console.log("db하위페이지에서 아래쪽 드랍 발생")
                insertAfter(dragDBblock,targetDBblcok);
                insertAfter(moveInnerAttr,targetInnerAttr);
            }
        })
        tag.addEventListener("dragover",(e)=>{
            //기본적으로 해야할 것
            //이거 안하면 드랍안됨
            e.stopPropagation();
            e.preventDefault()
        })
        //드래그를 시작했을때
        tag.addEventListener("dragstart",(e)=>{
            e.stopPropagation();
            e.currentTarget.classList.add("dragging")
            console.log("db하위페이지에서 드래그 시작:",e.currentTarget)
        })
        //드래그를 종료했을때
        tag.addEventListener("dragend",(e)=>{
            e.stopPropagation();
            e.currentTarget.classList.remove("dragging")
            console.log("db하위페이지에서 드래그 종료",e.currentTarget);
            
            // 속성 넘버링 추가하기
            pageAttrNumberingUpdate(e.currentTarget.parentElement);
        })
    })
}


// 이동 후 데이터 처리
function dbNumberingUpdate(blockNode){
    let layout = blockNode.closest("[data-layout]").getAttribute("data-layout");
    let prevEle = blockNode.previousElementSibling;
    let nextEle = blockNode.nextElementSibling;

    // 레이아웃이 칸반보드가 아닐 때 => 넘버링 업데이트
    if(layout != 'DB_BRD'){
        // 데이터베이스 하위의 데이터들은 display, page넘버링을 같이 관리
        let blockNum = dbDisplayNumbering(prevEle, nextEle);
        // db 업데이트용 데이터
        let data = {
            'email' : document.getElementById("UserInfoMod").querySelector(".email").textContent,
            'workId' : document.getElementById("TitleWid").value,
            'casePageId' : blockNode.closest("[data-layout]").getAttribute("data-block-id"),       // DB의 디스플레이 아이디
            'numbering' : blockNum
        }
        if(blockNum==nextEle.getAttribute("data-block-order")){
            // 전체 다시 넘버링
            let blocks = blockNode.closest('.db-block-body').querySelectorAll('.db_block');
            console.log(blocks);
            blocks.forEach((block, idx)=>{
                // console.log(block);
                let num = 512 * (idx+1);
                block.setAttribute("data-block-order", num); 
                block.setAttribute("data-page-order", num);
                data['pageId'] = block.getAttribute("data-page-id");
            })
        }else{
            // 해당 블럭만 넘버링
            blockNode.setAttribute("data-block-order", blockNum); 
            blockNode.setAttribute("data-page-order", blockNum);
            data['pageId'] = blockNode.getAttribute("data-page-id");
        }
        // DB에 업데이트
        console.log(data);
        dbpageNumbering(data);
    }

    // 레이아웃이 칸반보드일 때 => 넘버링 업데이트X, 상태속성값만 업데이트
    if(layout == 'DB_BRD'){
        let moveState = blockNode.closest("[data-state]").getAttribute("data-state")
        let blockAttrContent = blockNode.querySelector('[data-attrid="STATE"] .attr');
        blockAttrContent.innerText = moveState;
        //DB에 속성값 업데이트 진행
        let pui = blockNode.querySelector('[data-attrid="STATE"]').getAttribute("data-puse-id");
        updateAttrContent({'pageUseId' : pui, 'attrContent' : moveState});
    }
}

// 이동 후 데이터 처리 - 테이블 속성
function AttrNumberingUpdate(blockNode){
    let prevEle = blockNode.previousElementSibling;
    let nextEle = blockNode.nextElementSibling;

    let newNum = dbAttrNumbering(prevEle, nextEle);
    let nextNum = nextEle == null ? null : Number(nextEle.getAttribute("data-attr-order"));

    //DB업데이트용 데이터들
    let caseDiv = blockNode.closest("[data-layout]");
    let data = {
        'email' : document.getElementById("UserInfoMod").querySelector(".email").textContent,
        'casePageId' : caseDiv.getAttribute("data-block-id"),  // DB의 display id
        'pageId' : caseDiv.getAttribute("data-page-id"),
        'workId' : document.getElementById("TitleWid").value,
        'dbUseId' : blockNode.getAttribute("data-duse-id")
    }
    //넘버링 겹쳤을 때 넘버링 재설정
    if(newNum == nextNum){
        let nameNodes = blockNode.closest(".table-thead").querySelectorAll(".attr-name");
        nameNodes.forEach((namenode, idx)=> {
            let num = 512 * (idx+1);
            namenode.setAttribute("data-attr-order", num);
            //DB업데이트(해당 페이지 넘버, db에 히스토리 업데이트, page 업데이트)
            data['numbering'] = num;
            attrNumberUpdate(data);
        });
    } else {
        blockNode.setAttribute("data-attr-order", newNum);
        //DB업데이트
        data['numbering'] = newNum;
        attrNumberUpdate(data);
    }
}

// 이동 후 데이터 처리 - 페이지의 속성
async function pageAttrNumberingUpdate(blockNode){
    const prevLine = blockNode.previousElementSibling;
    const nextLine = blockNode.nextElementSibling;

    let targetBlock = blockNode.querySelector(".attr-name");
    let prevEle = prevLine != null ? prevLine.querySelector(".attr-name") : null;
    let nextEle = nextLine != null ? nextLine.querySelector(".attr-name") : null;

    let newNum = dbAttrNumbering(prevEle, nextEle);
    let nextNum = nextEle == null ? null : Number(nextEle.getAttribute("data-attr-order"));

    const pageId = blockNode.closest("[data-page-id]").getAttribute("data-page-id");
    //데이터베이스의 페이지아이디, 블럭아이디 가져오기
    let dbblock = await getDatabaseDBBlock(pageId);
    let data = {
        'email' : document.getElementById("UserInfoMod").querySelector(".email").textContent,
        'casePageId' : dbblock.displayId,  // DB의 디스플레이 아이디
        'pageId' : dbblock.pageId,       // DB의 페이지 아이디
        'workId' : document.getElementById("TitleWid").value,
        'dbUseId' : targetBlock.getAttribute("data-duse-id")
    }
    
    //넘버링 겹쳤을 때 넘버링 재설정
    // 모달로 연 페이지일 경우 DB블럭에도 data-attr-order 업데이트
    if(newNum == nextNum){
        // dbUseId마다 새로운 넘버링 생성
        let dbUseIdList = {};   // { dbUseId : 새로운넘버링값, dbUseId2 : 새로운넘버링값2, ... }

        // 쿼리셀렉터ALL을 제한해준다. 조건 : 현재 넘버링중인 db. casePageId로 검색 후 attr-name 선택
        const nameElements = document.querySelector(`[data-block-id="${data.casePageId}"]`).querySelectorAll(".attr-name");;
        nameElements.forEach((nameElement, idx)=> {
            let thisDui = nameElement.getAttribute("data-duse-id");
            if(!dbUseIdList[thisDui]){
                dbUseIdList[thisDui] = 512 * (idx+1);
            }
        }); // dbUseId마다 새로운 넘버링리스트 생성 forEach문 종료

        // 새롭게 넘버링할 element 리스트
        const newElements = document.querySelectorAll(".attr-name");
        newElements.forEach( ele => {
            let thisDui = ele.getAttribute("data-duse-id");
            if(dbUseIdList[thisDui]){
                ele.setAttribute("data-attr-order", dbUseIdList[thisDui]);
                data['dbUseId'] = thisDui;
                data['numbering'] = dbUseIdList[thisDui];
                console.log(dbUseIdList[thisDui])
                attrNumberUpdate(data);
            }
        }); // element 속성 변경 forEach 종료

    } else {
        const numberingList = document.querySelectorAll(`[data-duse-id="${data.dbUseId}"]`);
        numberingList.forEach( ele => {
            ele.setAttribute("data-attr-order", newNum);
        });
        //DB업데이트
        data['numbering'] = newNum;
        attrNumberUpdate(data);
    }
}

// 디스플레이 넘버링 계산 > 계산값 리턴
function dbDisplayNumbering(prevEle, nextEle){
    // data-block-order
    let prevNum = Number(prevEle.getAttribute("data-block-order"));
    let nextNum = Number(nextEle.getAttribute("data-block-order"));

    let averNum = Math.ceil((nextNum - prevNum)/2);
    let newNum = prevNum + averNum;
    return newNum;
}

// 속성 넘버링 계산
function dbAttrNumbering(prevEle, nextEle){
    // data-attr-order
    let prevNum = prevEle != null ? Number(prevEle.getAttribute("data-attr-order")) : 0;
    let nextNum = nextEle != null ? Number(nextEle.getAttribute("data-attr-order")) : 0;
    let averNum;    // 계산값
    let newNum;     // 새롭게 넘버링 될 값

    if (prevNum === 0) {
        // 첫번째 요소로 들어갔을 때
        newNum = Math.ceil(nextNum/2);
    } else if (nextNum === 0){
        // 마지막 요소로 들어갔을 때
        newNum = prevNum + 512;
    } else {
        averNum = Math.ceil((nextNum - prevNum)/2);
        newNum = prevNum + averNum;
    }

    console.log(prevNum, nextNum, newNum);
    return newNum;
}