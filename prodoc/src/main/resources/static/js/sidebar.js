
init();

const inviteList = []; //workJoin에 workId랑 초대 이메일 담아서 json으로 넘기는 배열
const wNameList = ['workType', 'publicCheck'];

//전체 JS 기능 실행함수
function init() {
    let email = document.querySelector("#side input.logUser").value;
    workList(email);
    document.querySelector('#wsCreate').addEventListener('click', newWorkSpace);
    document.querySelector('#insert-page').addEventListener('click', newPage);
}
let wp = document.querySelector("#wsPrivate");
let pa = document.querySelector("#priArrow");
let wt = document.querySelector("#wsType");
let ta = document.querySelector("#typeArrow");
let workModal = document.querySelector("#workModal");
let pageModal = document.querySelector("#pageModal");

//인사이트 내 사이드바 워크스페이스 목록 불러오기(AJAX)
function workList(email) {
    let url = '/workList?email='+email;
    fetch(url, {
            method: 'GET'
        })
        .then(response => {
            return response.json();
        })
        .then((data) => {
            let works = side.querySelectorAll('.Work');
            works.forEach(work => {
                work.remove()
            })
            data.forEach(item => {
                let side = document.querySelector('#side');
                let text = '<div class= "Work" data-id="'+item.workId+'">' + '<span class="workName">' + item.workName + '</span><span onclick="newPageModal(event)" class="add"><img class="plus" src="/images/plus.svg" width="15px" height="15px"></span> <img class="setting" src="/images/settings.svg" width="15px" height="15px"><div class = "pageMain"></div>'+'<input type="hidden" class ="num" value="0">'+ '<div>'
                side.insertAdjacentHTML("beforeend", text);
                let set = document.querySelectorAll('.setting');
                set.forEach((tag) => {
                    tag.addEventListener('click', setWork);
                    tag.addEventListener('click', typeChange);
                  //시인누나 커밋
            // let sett = document.querySelectorAll('.setting');
            //     sett.forEach((tag) => {
            //         tag.addEventListener('click', makeWid) 
            //     })

            })
        })
            document.querySelectorAll('#side .workName').forEach(works => {
                works.addEventListener('click', function (e) {
                    let target = e.target;
                    console.log(target);
                    if(target.classList.contains("clicked")){
                        target.classList.remove("clicked");
                        let pageDiv = target.parentElement.querySelector('.pageMain');
                        pageDiv.innerHTML = "";
                    }else{
                        target.classList.add("clicked");
                        let workClick = e.currentTarget.parentElement.dataset.id;
                        pageList(workClick,target);
                    }
                })
            })

            let list = side.querySelectorAll('.Work');
            console.log(list);
    })
}

//setting 분리하려고 nameArea 아래에 input:hidden으로 워크아이디 넣음
function makeWid(e) {

    let workId = e.currentTarget.closest('.Work').children[1].textContent;
    let wInput = document.createElement('input');
    wInput.type = 'hidden';
    wInput.id = 'wid';
    wInput.value = workId;

    let old = document.getElementById('nameArea').lastChild;

    if (old.id == 'wid') {
        old.replaceWith(wInput);
    } else {
        document.querySelector('#nameArea').appendChild(wInput);
    }
}

// 선택한 워크스페이스와 DB내의 워크스페이스 일치과정.(DB ID로 조회하는거 추가해야함)
function selectWork(workClick) {
    let url = '/workList';
    fetch(url, {
            method: 'GET'
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                if (wId == data[i]) {
                    // console.log(data[i])
                    //워크 ID 들고와서 일치시켰으니 페이지 정보 띄우기.
                }
            }
        })
}

//새로운 워크스페이스 삽입 모달창생성(+ 클릭시)
function newWork() {
    workModal.style.display = "block";
    document.body.style.overflow = "hidden";
    document.querySelector('#typeArea').classList.remove('hide');
    document.querySelector('#deleteBtn').classList.add('hide');
    let creBtn = document.createElement('button');
    creBtn.id = 'wsCreate';
    creBtn.textContent = '생성';
    document.querySelector('#btnArea').firstElementChild.replaceWith(creBtn);
    document.querySelector('#wsCreate').addEventListener('click', newWorkSpace);
}

// 인사이트 내 사이드바에 페이지 목록 불러옴
function pageList(wId, target) {
    let insertDiv = target.parentElement.querySelector('.pageMain');
    let url = '/pageList?workId=' + wId;
    fetch(url)
    .then(res => {
        return res.json();
    })
    .then(data => {
            data.forEach(item=> {
                let text = '<div class= "Page" data-id="'+item.pageId+'">' + '<span class="pageName">' + ' ' + item.pageName + '</span><span onclick="newPageModal(event)" class="add"><img class="plus" src="/images/plus.svg" width="15px" height="15px"></span> <div class = "pageMain"></div> <div>';
                insertDiv.insertAdjacentHTML("beforeend", text);
            })
            document.querySelectorAll('#side .pageName').forEach(Pages => {
                Pages.addEventListener('click', function(e){
                    let target = e.target;
                    console.log(target);
                    if(target.classList.contains("clicked")){
                        target.classList.remove("clicked");
                        let pageDiv = target.parentElement.querySelector('.pageMain');
                        pageDiv.innerHTML = "";
                    }else{
                        target.classList.add("clicked");
                        let pageClick = e.currentTarget.parentElement.dataset.id;
                        pageInPage(pageClick,target);
                    }
                })
            })
    })
    .catch((err) => console.log('err: ', err));
}
// 페이지 선택시 PID 불러오기 + 리스트노출. 
function selectPage(pageName) {
    let insertDiv = target.parentElement.querySelector('.pageSub');
    let url = '/pageInfo?pageId=' + pageName;
    fetch(url)
    .then(res => {
        return res.json();
      })
    .then((data) => {
        data.forEach(item => {
            let text = ''
        })
    })
}
// 새로운 페이지 생성.
function newPage() {
    let workId = document.querySelector('#workId').value;
    let parentId = document.querySelector('#parentId').value;
    let caseId = document.querySelector('#caseId').value;
    let creUser = document.querySelector('#loginUser').value;
    let pageName = document.querySelector('#pgName').value;
    let val = {
        parentId,
        pageName,
        creUser,
        workId,
        caseId
    }
    let url = '/pageInsert';
    fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(val)
                })
                .then(response => response.text())
                .then((pageId) => {
                    if(parentId){
                        let parent = document.querySelector('.Page[data-id='+parentId+']');
                        let insertDiv = parent.querySelector('.pageMain');
                        pageInPage(parentId,insertDiv);
                    }else{
                        let works = document.querySelector('.Work[data-id='+workId+']');
                        let insertDiv = works.querySelector('.pageMain');
                        let text =  `<div class= "Page"><span class="pageId" data-id='${pageId}'>${pageName}</span><span onclick="newPageModal(event)" class="add"><img class="plus" src="/images/plus.svg" width="15px" height="15px"></span> <div class = "pageMain"></div> <div>`;
                        insertDiv.insertAdjacentHTML("afterend", text);
                    }
                    // sendSocket(pageId);
                    closeModal();
                })
                .catch(err => console.log(err));
}


//새로운 페이지 삽입 모달창생성(+ 클릭시)
function newPageModal(event) {
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    let wId = event.target.closest('.Work').dataset.id;
    let pId = '';
    if(event.target.closest('.pageMain')){
        pId = event.target.closest('.Page').dataset.id;
    }
    let url = '/workId?workId=' + wId;
    fetch(url)
    .then(res => {
        return res.text();
    })
    .then((data) => {
        let workId = document.querySelector('#workId');
        workId.value = wId;
        let parentId = document.querySelector('#parentId');
        parentId.value = pId;
    })
    .catch((err) => console.log('err: ', err));
    }


//페이지 안의 페이지 여는 기능
function pageInPage(pId,target){
    let insertDiv = target.parentElement.querySelector('.pageMain');
    let url = '/pageInPage?pageId='+pId;
    fetch(url)
    .then(res => {
        return res.json();
    })
    .then(data => {
        data.forEach(item => {
            let text = '<div class= "Page" data-id="'+item.pageId+'">' + '<span class="pageName">' + ' ' + item.pageName + '</span>' + '<span class="workIdVal">'+ item.workId +'</span>' + ' <span onclick="newPageModal(event)" class="add"><img class="plus" src="/images/plus.svg" width="15px" height="15px"></span> <div class = "pageMain"></div> <div>';
            insertDiv.insertAdjacentHTML("beforeend",text)
        })
        let inPageDiv = target.parentElement.querySelector('.pageMain');
        inPageDiv.querySelectorAll('.pageName').forEach(Pages => {
            Pages.addEventListener('click', function(e){
                let target = e.target;
                console.log(target);
                if(target.classList.contains("clicked")){
                    target.classList.remove("clicked");
                    let pageDiv = target.parentElement.querySelector('.pageMain');
                    pageDiv.innerHTML = "";
                }else{
                    target.classList.add("clicked");
                    let pageClick = e.currentTarget.parentElement.dataset.id;
                    pageInPage(pageClick,target);
                }
            })
        })
    })
}

function clickPage(){
    document.querySelectorAll('#side .pageName').forEach(Pages => {
        Pages.addEventListener('click', function(e){
            let target = e.target;
            console.log(target);
            if(target.classList.contains("clicked")){
                target.classList.remove("clicked");
                let pageDiv = target.parentElement.querySelector('.pageMain');
                pageDiv.innerHTML = "";
            }else{
                target.classList.add("clicked");
                let pageClick = e.currentTarget.parentElement.dataset.id;
                pageInPage(pageClick,target);
            }
        })
    })
}
//모달창 닫는 기능
function closeModal() {
    workModal.style.display = "none";
    pageModal.style.display = "none";
    document.body.style.overflow = "auto";
    document.querySelector('#caseId').value = "";
    document.querySelector('#workId').value = "";
    document.querySelector('#parentId').value = "";
    document.querySelector('#pgName').value = "";

    let input = document.querySelectorAll('input');
    input.forEach(item => {
        item.value = '';
    })

    //워크스페이스 닫을때 워.스.값 리셋하는거
    for (let field of wNameList) {

        let wselect = document.querySelectorAll('select[name="' + field + '"]');
        wselect.forEach((item) => {
            item.options[0].selected = true;
        })
    }
}

//페이지-템플릿 목록 띄움
function template() {
    temPage.style.display = "block";
    pageContent.style.display = "none";
    dbPage.style.display = "none";
}
//페이지-DB 목록 띄움
function database() {
    dbPage.style.display = "block";
    pageContent.style.display = "none";
    temPage.style.display = "none";
}
//페이지-템플릿 선택시 페이지생성에 템플릿 종류 삽입
function selectTemp(event) {
    let temp = event.currentTarget.innerText;
    let caseId = document.querySelector('#caseId');
    caseId.value = temp;
}
//페이지- DB 선택시 페이지생성에 DB 종류 삽입
function selectDb(event) {
    // let selId = event.currentTarget.id;
    let db = event.currentTarget.innerText;
    let caseId = document.querySelector('#caseId');
    caseId.value = db;
}
wt.addEventListener("click", (e) => {
    ta.classList.toggle("turn");
})
wt.addEventListener("focusout", (e) => {
    ta.classList.remove("turn");
})
wp.addEventListener("click", (e) => {
    pa.classList.toggle("turn");
})
wp.addEventListener("focusout", (e) => {
    pa.classList.remove("turn");
})

// //웹 소켓
// function sendSocket(pageId) {
//     stompClient.publish({
//         destination: "/app/updateCmd",
//         body: JSON.stringify({'cmd': 'createPage',content:pageId})
//     });
// }
//======================================================================

//워크스페이스 설정창 여는..거
async function setWork(e) {
    workModal.style.display = 'block';
    document.body.style.overflow = "hidden";

    let workId = e.currentTarget.closest('.Work').children[1].textContent;
    let infoResult = await selectOneWork(workId);
    let memResult = await memberList(workId);

    let tTog = document.querySelector('#teamToggleArea');
    let name = document.querySelector('#nameArea'); //워.스.이름영역
    let pub = document.querySelector('#pubArea'); //공개범위 영역
    let type = document.querySelector('#typeArea'); //타입 영역
    let own = document.querySelector('#ownArea'); //소유자 영역
    let del = document.querySelector('#deleteBtn'); //삭제로 넘어가는 버튼
    let delCheck = document.querySelector('#delCheckArea'); //삭제확인
    let inv = document.querySelector('#inviteUser');
    let mem = document.querySelector('#memberArea'); //멤버 출력(권한,내보내기할수있음)
    let btnAr = document.querySelector('#btnArea');
    let outMemAr = document.querySelector('#outmemArea');

    let editBtn = document.createElement('button');
    editBtn.id = 'wsEdit';
    editBtn.textContent = '저장';
    btnAr.firstElementChild.replaceWith(editBtn);

    //공통으로 보여야 하는 영역
    del.classList.remove('hide');
    type.classList.add('hide');
    delCheck.classList.add('hide');
    own.classList.remove('hide');
    pub.classList.remove('hide');
    name.classList.remove('hide');
    outMemAr.classList.add('hide');

    if (infoResult == 'TEAM') {
        tTog.classList.remove('hide');
        //팀 워크스페이스인 경우 설정/멤버 토글.

        document.querySelector('#workEdit').addEventListener('click', function (e) {
            //설정일때 보여야 하는거
            own.classList.remove('hide');
            del.classList.remove('hide');
            pub.classList.remove('hide');
            inv.classList.add('hide');
            mem.classList.add('hide');
            name.classList.remove('hide');
            btnAr.classList.remove('hide');
            outMemAr.classList.add('hide');

        })

        document.querySelector('#teamEdit').addEventListener('click', function (e) {
            //멤버일때 보여야 하는거
            pub.classList.add('hide');
            del.classList.add('hide');
            name.classList.add('hide');
            own.classList.add('hide');
            inv.classList.remove('hide');
            mem.classList.remove('hide');
            btnAr.classList.add('hide');
            outMemAr.classList.add('hide');

        })

    } else if (infoResult == 'PERSONAL') {
        //개인일때 보여야 하는거
        tTog.classList.add('hide');
        own.classList.add('hide');
        inv.classList.add('hide');
        mem.classList.add('hide');
        pub.classList.remove('hide');
        name.classList.remove('hide');
        btnAr.classList.remove('hide');
        outMemAr.classList.add('hide');

    }

    //저장 버튼 눌렀을 때 수정
    editBtn.addEventListener('click', function (e) {
        editWorkSpace(workId);
    });

    //삭제하기 버튼 누르면 삭제 모달로 넘어감.
    document.querySelector('#deleteBtn').addEventListener('click', function (e) {
        delCheck.classList.remove('hide');
        tTog.classList.add('hide');
        pub.classList.add('hide');
        del.classList.add('hide');
        document.querySelector('#wsName').readOnly = true;

        let delBtn = document.createElement('button');
        delBtn.id = 'wsDel';
        delBtn.textContent = '삭제';
        btnAr.firstElementChild.replaceWith(delBtn);

        delBtn.addEventListener('click', function (e) {

            deleteWorkS(workId);
        });
    });

    //멤버 내보내기 버튼 누르면 내보내기 창으로 넘어감.
    document.querySelector('#memberOut').addEventListener('click', function (e) {
        tTog.classList.add('hide');
        inv.classList.add('hide');
        mem.classList.add('hide');
        btnAr.classList.remove('hide');
        outMemAr.classList.remove('hide');


        let outBtn = document.createElement('button');
        outBtn.id = 'outMem';
        outBtn.textContent = '내보내기';
        btnAr.firstElementChild.replaceWith(outBtn);

        let checkbox = document.getElementsByName('member');
        let val = [];
        checkbox.forEach(item => {
            if (item.checked) {
                if (item.value != 'checkAll') {
                    // console.log(item.parentElement.closest('tr'));
                    let workId = item.parentElement.closest('tr').children[0].firstElementChild.value;
                    let email = item.parentElement.closest('tr').children[1].textContent;

                    let trTag = document.createElement('tr');
                    let tdTag = document.createElement('td');

                    tdTag.textContent = email;
                    trTag.appendChild(tdTag);

                    let td = document.createElement('td');
                    let noBtn = document.createElement('button');
                    noBtn.textContent = '제외';
                    td.appendChild(noBtn);
                    trTag.appendChild(td);
                    document.querySelector('#outmemList').appendChild(trTag);

                    val.push({
                        workId,
                        email
                    });

                    noBtn.addEventListener('click', function (e) {
                        let targetTd = e.currentTarget.parentElement.previousSibling;
                        console.log(val);
                        val = val.filter(i => i.email != targetTd.textContent);
                        console.log(val);
                        targetTd.parentElement.remove();
                    })


                }
            }
        });
        // 실제로 내보내는 함수
        outBtn.addEventListener('click', memberOut(val));
    })


}

//체크박스 전체 선택/취소
function selectAll(selectAll) {
    let checkboxes = document.getElementsByName('member');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    })
}

//새 워크스페이스 생성
function newWorkSpace() {

    let workType = document.querySelector('#wsType');
    let publicCheck = document.querySelector('#wsPrivate');
    let email = document.querySelector('#loginUser').value;
    let workName = document.querySelector('#wsName');

    let val = {
        "parentId": '',
        "workType": workType.value,
        "workName": workName.value,
        "publicCheck": publicCheck.value,
        email
    };
    let url = '/workInsert';

    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(val)
        })
        .then(response => response.text())
        .then(result => {

            console.log(result);
            if (workType == 'TEAM') {
                inviteWork(result); //워크스페이스 초대하는 메소드
            }
            closeModal();
            workList();

        })
        .catch(err => console.log(err));
}

function subWorkSpace() {

    let workType = document.querySelector('#wsType');
    let publicCheck = document.querySelector('#wsPrivate');
    let email = document.querySelector('#loginUser').value;
    let workName = document.querySelector('#wsName');
    let parentId = document.querySelector('#wid').value;

    let val = {
        parentId,
        "workType": workType.value,
        "workName": workName.value,
        "publicCheck": publicCheck.value,
        email
    };
    let url = '/workInsert';

    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(val)
        })
        .then(response => response.text())
        .then(result => {

            console.log(result);
            if (workType == 'TEAM') {
                inviteWork(result); //워크스페이스 초대하는 메소드
            }
            closeModal();
            workList();

        })
        .catch(err => console.log(err));
}

//워크스페이스 타입별 select option 구분 / 초대 부분 노출여부
document.querySelector('#wsType').addEventListener('change', typeChange);

function typeChange(e) {
    let invite = document.querySelector('#inviteUser'); //초대 부분
    let memberOption = document.querySelector('#memOption'); //멤버공개옵션(팀)
    let privateOption = document.querySelector('#privOption'); //비공개옵션(개인)
    if (e.target.value == 'TEAM') {
        invite.classList.remove('hide');
        memberOption.classList.remove('hide');
        privateOption.classList.add('hide');
    } else {
        invite.classList.add('hide');
        memberOption.classList.add('hide');
        privateOption.classList.remove('hide');
    }
};


//엔터 누르면 추가되게...
document.querySelector('#invEmail').addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        addList();
    }
});

let invBtn = document.querySelector('#inviteBtn');

//추가 버튼 누르면 밑에 테이블 아래에 목록 추가됨
invBtn.addEventListener('click', addList);

function addList() {
    let mail = document.querySelector('#invEmail');


    if (mail.value != '') {

        let trTag = document.createElement('tr');
        let tdTag = document.createElement('td');
        tdTag.textContent = mail.value;

        trTag.appendChild(tdTag);
        document.querySelector('#invList').appendChild(trTag);

        mail.value = '';
        mail.focus();
    } else {
        alert('이메일을 입력해 주십시오.');
        mail.focus();
    }
};

function inviteWork(workId) {

    let tdList = document.querySelectorAll('#invList > tr > td');
    tdList.forEach((item) => {
        let inviteEmail = item.textContent;
        inviteList.push({
            workId,
            inviteEmail
        })
    })

    let url = '/workJoin';

    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inviteList)
        })
        .then(response => response.text())
        .then(result => {
            console.log(result + '건 성공');
            tdList.forEach((item) => {
                item.textContent = '';
            })
        })
        .catch(err => console.log(err));

}

const arr = ['workId', 'email', 'auth'];

async function memberList(workId) {
    let authAry = [{
        val: 'MANAGER',
        text: '관리자'
    }, {
        val: 'NOMAL',
        text: '사용자'
    }];
    let url = `/memberList?workId=${workId}`;
    let mail = [];

    await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            document.querySelector('#memList').replaceChildren();
            for (let num of result) {
                mail.push({
                    workId,
                    email: num.email,
                    auth: num.auth
                });

                let trTag = document.createElement('tr');

                for (let field of arr) {
                    if (field == 'workId') {
                        let tdTag = document.createElement('td');
                        let inputTag = document.createElement('input');
                        inputTag.type = 'hidden';
                        inputTag.value = num[field];
                        tdTag.appendChild(inputTag);
                        trTag.appendChild(tdTag);
                    } else {
                        let tdTag = document.createElement('td');
                        tdTag.textContent = num[field];
                        trTag.appendChild(tdTag);
                    }
                }
                //삭제 체크박스
                let tdTag = document.createElement('td');
                let check = document.createElement('input');
                check.name = 'member';

                //권한 select 생성
                let td = document.createElement('td');
                let authSelect = document.createElement('select');
                authSelect.id = 'memberAuth';

                //권한 option 생성
                for (let option of authAry) {
                    let memOp = document.createElement('option');
                    memOp.value = option.val;
                    memOp.textContent = option.text;
                    authSelect.appendChild(memOp);
                }

                authSelect.addEventListener('change', function (e) {
                    console.log(e.currentTarget.value);
                })

                check.type = 'checkbox';
                tdTag.appendChild(check);
                td.appendChild(authSelect);

                trTag.appendChild(tdTag);
                trTag.appendChild(td);

                document.querySelector('#memList').append(trTag);
            }
        })
        .catch(err => console.log(err));
    return mail;
}

//워크스페이스 설정에 쓸 단건조회
async function selectOneWork(workId) {
    let selectResult = '';

    let url = `/workInfo?workId=${workId}`;
    await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            for (let field in result) {
                if (field == 'workName') {
                    let WNInput = document.querySelector(`[name="${field}"]`);
                    WNInput.value = result[field];
                }
                for (let nm of wNameList) {
                    if (field == nm) {
                        let list = document.querySelector(`[name="${field}"]`);
                        list.value = result[field];
                    }
                }
            }
            selectResult = result.workType;
        })
        .catch(err => console.log(err));
    return selectResult;
}

function deleteWorkS(workId) {
    let workNm = document.querySelector('#wsName');
    let nameCheck = document.querySelector('#delCheck');


    if (nameCheck.value == workNm.value) {

        let url = `/workDelete`;
        console.log(workId);
        fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: workId
            })
            .then(response => response.text())
            .then(result => {
                alert('워크스페이스가 삭제되었습니다.');
                closeModal();
                workList();
            })
            .catch(err => console.log(err));

    } else {
        alert('워크스페이스명이 일치하지 않습니다. 확인 후 다시 시도해주세요.');
    }

}

function editWorkSpace(workId) {
    let publicCheck = document.querySelector('#wsPrivate');
    let workName = document.querySelector('#wsName');
    let val = {
        workId,
        "workName": workName.value,
        "publicCheck": publicCheck.value,
    };
    let url = '/workEdit';

    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(val)
        })
        .then(response => response.text())
        .then(result => {
            alert('워크스페이스가 수정되었습니다.')
            closeModal();
            workList();
        })
        .catch(err => console.log(err));
}

function memberOut(list) {

    let url = '/memberDelete';

    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(list)
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            closeModal();
        })
        .catch(err => console.log(err))

}

function renewMemberAuth(list) {

    let url = '/memberRenewAuth';
    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(list)
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            if (result == list.length) {
                alert('권한이 변경되었습니다.')
            } else {
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            }
        })
        .catch(err => console.log(err));

}


document.querySelector('#ownArea').firstElementChild.addEventListener('change', function (e) {
    let email = document.querySelector('#ownArea').firstElementChild;
    let workId = document.querySelector('#wid').value;

    console.log(email.value);
    let val = []


    if (email != '') {
        val.push({
            workId,
            "email": email.value,
            "auth": "OWNER"
        });

        let changemail = document.querySelector('#loginUser');
        val.push({
            workId,
            "email": changemail.value,
            "auth": "MANAGER"
        });
        renewMemberAuth(val);
    } else {
        alert('이메일의 형식과 맞지 않습니다. 다시 입력해주십시오.');
    }
})

//워크스페이스 초대 리스트 불러옴
async function listWorkJoin(workId) {

    let url = `/joinList?workId=${workId}`;
    let mailList = [];
    await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            mailList.push(result.inviteEmail);
        })
        .catch(err => console.log(err));

    return mailList;
}