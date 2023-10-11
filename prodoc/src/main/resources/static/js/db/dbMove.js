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

            // 마우스 위치관련 변수 정의
            const targetWidth = targetDBblcok.offsetWidth;
            const targetVerticalCenter = targetWidth / 2;
            const rect = targetDBblcok.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;

            const dragDuseId = dragDBblock.dataset.duseId;
            const targetDuseId = targetDBblcok.dataset.duseId;

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
    })

    // 그 외의 데이터베이스 드래그 이벤트
    const dbBlock = document.querySelectorAll(".db_block");
    dbBlock.forEach(item=>{
        item.addEventListener("drop",(e)=>{
            e.stopPropagation(); // container의 drop 이벤트를 막기위함
            const dragDBblock = document.querySelector(".dragging");
            const targetDBblcok = e.currentTarget;

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
                console.log(block);
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

// 이동 후 데이터 처리 - 속성
function AttrNumberingUpdate(blockNode){
    let prevEle = blockNode.previousElementSibling;
    let nextEle = blockNode.nextElementSibling;

    let newNum = dbAttrNumbering(prevEle, nextEle);
    let nextNum = Number(nextEle.getAttribute("data-attr-order"));

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
        console.log(data);
        });
    } else {
        blockNode.setAttribute("data-attr-order", newNum);
        //DB업데이트
        data['numbering'] = newNum;
        attrNumberUpdate(data);
        console.log(data);
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
    let prevNum = Number(prevEle.getAttribute("data-attr-order"));
    let nextNum = Number(nextEle.getAttribute("data-attr-order"));

    let averNum = Math.ceil((nextNum - prevNum)/2);
    let newNum = prevNum + averNum;
    return newNum;
}