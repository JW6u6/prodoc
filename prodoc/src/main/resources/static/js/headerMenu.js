//나중에 따로 다른데로 옮기던가 해도 괜찮을거같은데...(이걸 왜 여기서?하고있지?)

document.querySelector('#mainPage').addEventListener('click', ThisMainPage);
document.querySelector('#delPage').addEventListener('click', pageDelCheck);
document.querySelector('#notifyPage').addEventListener('click', toggleNotiPage);
document.querySelector('#copyLink').addEventListener('click', creLink);


//페이지 잠금(소유자/관리자)
document.querySelector('#lockPg').addEventListener('click', function (e) {

    let url = '/pageLock';

    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify()
    })
        .then(response => response.text())
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));

})

//페이지 잠금해제 요청(일반 사용자)
function pageLockNoti() {
    let pageInfo = '';

    if (pageInfo) {
        //페이지 정보에서 잠금여부가 true면 잠금해제하고 아니면 잠금요청 보내는 걸... 작성해야됨
        //웹소켓어케함요...
    }
}

//페이지 삭제 체크
//페이지 url로 읽어와서 페이지 아이디 넘기는거 해야함.
function pageDelCheck() {

    let pageId = '';

    let url = '/pageDelCheck';

    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageId)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
}

//현재 페이지를 메인 페이지로 등록(소유자, 관리자?)
//워크스페이스 아이디 불러오고, 페이지 url가져오는거 해야함.
function ThisMainPage() {

    let pageId = '';
    let workId = '';

    let val = {
        mainPageId: pageId,
        workId
    }

    let url = '/workMainPg';

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
        })
        .catch(err => console.log(err));
}

//페이지id로 워크스페이스 아이디 가져오는거(필요없어지면 지움)
async function findWid(pageId) {

    let url = '/findWork?pageId=' + pageId;
    let workId;

    await fetch(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            workId = result;
        })
        .catch(err => console.log(err));

    return workId;
}

//페이지 알림 끄기
function toggleNotiPage() {
    let url = '/pageNotify';
    let email = '';
    let pageId = '';
    let workId = findWid(pageId);

    let val = {
        workId,
        pageId,
        email
    }

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
            let notiToggle = document.querySelector('#notifyPage');
            if (result == 0) {
                notiToggle.textContent = '페이지 알림 끄기';
            } else if (result == 1) {
                notiToggle.textContent = '페이지 알림 켜기';
            }
        })
        .catch(err => console.log(err));
}

//링크복사(실험)
function creLink() {
    let url = '';    // <a>태그에서 호출한 함수인 clip 생성
    let linkText = document.createElement("textarea");
    //url 변수 생성 후, textarea라는 변수에 textarea의 요소를 생성

    document.body.appendChild(linkText); //</body> 바로 위에 textarea를 추가(임시 공간이라 위치는 상관 없음)
    url = window.document.location.href;  //url에는 현재 주소값을 넣어줌
    linkText.value = url;  // textarea 값에 url를 넣어줌
    linkText.select();  //textarea를 설정
    document.execCommand("copy");   // 복사
    document.body.removeChild(linkText); //extarea 요소를 없애줌

    alert("URL이 복사되었습니다.")  // 알림창
}