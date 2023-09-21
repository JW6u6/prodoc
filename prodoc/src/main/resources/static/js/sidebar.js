init();

const inviteList = []; //workJoin에 workId랑 초대 이메일 담아서 json으로 넘기는 배열

//전체 JS 기능 실행함수
function init() {
    workList();
    document.querySelector('#wsCreate').addEventListener('click', newWorkSpace);
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
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                let side = document.querySelector('#side');
                let wId = data[i];
                let text = '<div class= "Work">' + '<span class="workId">' + wId + '</span>' + ' <span onclick="newPage()" class="add">➕</span> <div>'
                side.insertAdjacentHTML("beforeend", text);
            }
            document.querySelectorAll('#side .Work').forEach(works => {
                works.addEventListener('click', function (e) {
                    let wId = e.currentTarget.firstElementChild.innerText;
                    selectWork(wId);
                });
            })
            pageList();
        })
    }
// 선택한 워크스페이스와 DB내의 워크스페이스 일치과정.(DB ID로 조회하는거 추가해야함)
function selectWork(wId) {
    let url = '/workList';
    fetch(url, {
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                if (wId == data[i]) {
                    console.log(data[i])
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

// 인사이트 내 사이드바에 페이지 목록 불러옴
function pageList() {
    let url = '/pageList';
    let wId = "";
    
    fetch(url,{
        method:'GET',
    })
    .then(response =>{
        return response.json();
    })
    .then(data=>{
        document.querySelectorAll('#side .Work').forEach(works => {
            workId = works.firstElementChild.innerText;
            console.log(wId);
        })
        for(let i=0;i<data.length;i++){
        pId = data[i].pageId;
        console.log(data[i].pageId);
        if(wId == data[i].workId){

        }
        let side = document.querySelector('#side');
        let text = '<div class= "Page">' + '<span class = "pageVal" >' + pId + '</span>' + ' <span onclick="newSubPage()" class="add">➕</span> <div>'
        side.insertAdjacentHTML("beforeend",text);
        }
        
        document.querySelectorAll('#side .Page').forEach(pages =>{
            pages.addEventListener('click',function(e){
                let pageClick = e.currentTarget.firstElementChild.innerText;
                console.log(pageClick);
                selectPage(pageClick);
            })
        })
       
    })
}

// 페이지 선택시 PID 불러오기
function selectPage(pageClick) {
    let url = '/pageInfo?pageId='+pageClick;
    fetch(url)
    .then(res => {
        return res.json();
      })
    .then(data => {
        console.log(data);
    })
}

// 페이지 삽입 AJAX
// function insertPage() {
//     let parentId = document.querySelector
//     let pageName = document.querySelector('#pgName').value;
//     let creUser = document.querySelector('#loginUser').value;
//     let workId = 1;
//     let caseId = 1;//해당 템플릿 클릭시 case 선택가능
//     let val = { parentId, pageName, creUser, workId, caseId}
// //     let numbering = a;
// //     let caseId = 1; //해당 템플릿 클릭시 case 선택가능
// //     let val = {
// //         parentId,
// //     }
//     let url = '/pageInsert';

//     fetch(url, {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(val)
//         })
//         .then(response => response.text())
//         .then(result => console.log(result))
//         .catch(err => console.log(err));
// }
//새로운 페이지 삽입 모달창생성(+ 클릭시)
function newPage() {
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    let val = event.currentTarget.previousElementSibling;
    console.log(val);
}
//새로운 서브-페이지 삽입 모달창생성(+ 클릭시)
function newSubPage() {
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    // event.currentTarget.nextElementSibling.innerHTML += '<div class = "Page">페이지<span onclick="newSSPage()" class="add">➕</span> <div>'
    let val = event.currentTarget.previousElementSibling.innerText;
    console.log(val); // 부모 page ID 찾아둠.
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
function selectTemp() {
    // let selId = event.currentTarget.id;
    $('#caseId').val("temp")
}
//페이지- DB 선택시 페이지생성에 DB 종류 삽입
function selectDb() {
    // let selId = event.currentTarget.id;
    $('#caseId').val("db")
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

    let workType = document.querySelector('#wsType').value;
    let publicCheck = document.querySelector('#wsPrivate').value;
    let email = document.querySelector('#loginUser').value;
    let workName = document.querySelector('#wsName').value;
    let val = {
        workType,
        workName,
        publicCheck,
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
            pageList();
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


let invBtn = document.querySelector('#inviteBtn');

//추가 버튼 누르면 밑에 테이블 아래에 목록 추가됨
invBtn.addEventListener('click', function (e) {
    let mail = document.querySelector('#invEmail');
    let trTag = document.createElement('tr');
    let tdTag = document.createElement('td');
    tdTag.textContent = mail.value;

    trTag.appendChild(tdTag);
    document.querySelector('#invList').appendChild(trTag);

    mail.value = '';
});

function inviteWork(workId) {

    let mail = document.querySelectorAll('#invList > tr > td');
    mail.forEach((item) => {
        let inviteEmail = item.textContent;
        inviteList.push({workId, inviteEmail})
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
            if(result == 'TRUE'){
                console.log('성공');
            }
        })
        .catch(err => console.log(err));

}