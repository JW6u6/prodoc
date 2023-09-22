init();

const inviteList = []; //workJoin에 workId랑 초대 이메일 담아서 json으로 넘기는 배열

//전체 JS 기능 실행함수
function init() {
    workList();
    document.querySelector('#wsCreate').addEventListener('click', newWorkSpace);
    document.querySelector('#insert-page').addEventListener('click', newPage)
}
let wp = document.querySelector("#wsPrivate");
let pa = document.querySelector("#priArrow");
let wId = document.querySelector('#workId')
let wt = document.querySelector("#wsType");
let ta = document.querySelector("#typeArrow");
let workModal = document.querySelector("#workModal");
let pageModal = document.querySelector("#pageModal");

//인사이트 내 사이드바 워크스페이스 목록 불러오기(AJAX)
function workList() {
    let url = '/workList';
    fetch(url, {
            method: 'GET'
        })
        .then(response => {
            return response.json();
        })
        .then((data) => {
            data.forEach(item => {
                let side = document.querySelector('#side');
                let plusImg = document.querySelector('.plus');
                console.log(plusImg.src);
                let text = '<div class= "Work">' + '<span class="workId">' + item.workName + '</span>' + ' <span onclick="newPageModal(event)" class="add">' + plusImg.src + '</span> <div class = "page1"></div> <div>'
                side.insertAdjacentHTML("beforeend", text);
            })
            document.querySelectorAll('#side .workId').forEach(works => {
                works.addEventListener('click', function (e) {
                    let target = e.target;
                    let workClick = e.currentTarget.innerText;
                    
                    console.log(workClick)
                    pageList(workClick,target);
                    // selectWork(workClick);
                })
            })
        })
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

}

let pageClick = 0;
// 인사이트 내 사이드바에 페이지 목록 불러옴
function pageList(wId,target) {
    let insertDiv = target.parentElement.querySelector('.page1');
    console.log(insertDiv);
    let url = '/pageList?workName='+wId;
    console.log(target)
    fetch(url)
    .then(res => {
        return res.json();
    })
    .then(data => {
        pageClick += 1;
        if ( pageClick%2 ==0){
            while(insertDiv.hasChildNodes()){
                insertDiv.removeChild(insertDiv.firstChild);
            }
        }else{
            data.forEach(item=> {
                let text = '<div class= "Page">' + '<span class="pageId">' + 'ㄴ' + item.pageName + '</span>' + ' <span onclick="newSubPage()" class="add">➕</span>  <div>';
                insertDiv.insertAdjacentHTML("beforeend", text);
            })
        }
    })
    .catch((err) => console.log('err: ', err));
}

// 페이지 선택시 PID 불러오기
function selectPage(pageClick) {
    let url = '/pageInfo?pageId='+pageClick;
    fetch(url)
    .then(res => {
        return res.json();
      })
    .then((data) => {
       
    })
}

function newPage(){
    let workId = document.querySelector('#workId').value;
    let parentId = document.querySelector('#parentId').value;
    let caseId = document.querySelector('#caseId').value;
    let creUser = document.querySelector('#loginUser').value;
    let pageName = document.querySelector('#pgName').value;
    let val = { parentId, pageName, creUser, workId, caseId}
    let url = '/pageInsert';
console.log(val);
    fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(val)
                })
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(err => console.log(err));
}

//새로운 페이지 삽입 모달창생성(+ 클릭시)
function newPageModal(event) {
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    let wName = event.currentTarget.previousElementSibling.innerText;
    console.log(wName);
    let url = '/workId?workName='+wName;
    fetch(url)
    .then(res => {
        return res.text();
    })
    .then((data) => {
        let workId = document.querySelector('#workId');
        workId.value = data;
    })
    .catch((err) => console.log('err: ', err));
    }
//새로운 서브-페이지 삽입 모달창생성(+ 클릭시)
function newSubPage() {
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    // event.currentTarget.nextElementSibling.innerHTML += '<div class = "Page">페이지<span onclick="newSSPage()" class="add">➕</span> <div>'
    let val = event.currentTarget.previousElementSibling.innerText;
    let parentPageId = document.querySelector('#pageId');
    parentPageId.value = val;
}
//모달창 닫는 기능
function closeModal() {
    workModal.style.display = "none";
    pageModal.style.display = "none";
    document.body.style.overflow = "auto"
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
//======================================================================


//새 워크스페이스 생성
function newWorkSpace() {

    let workType = document.querySelector('#wsType');
    let publicCheck = document.querySelector('#wsPrivate');
    let email = document.querySelector('#loginUser').value;
    let workName = document.querySelector('#wsName');
    let val = {
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
            workType.options[0].selected = true;
            publicCheck.options[0].selected = true;
            workName.value = '';
        })
        .catch(err => console.log(err));
}

//워크스페이스 타입별 select option 구분 / 초대 부분 노출여부
document.querySelector('#wsType').addEventListener('change', function (e) {
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
});



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

function deleteWork() {

}