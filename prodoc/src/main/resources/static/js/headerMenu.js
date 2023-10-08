
//나중에 따로 다른데로 옮기던가 해도 괜찮을거같은데...(이걸 왜 여기서?하고있지?)

document.querySelector('#mainPage').addEventListener('click', ThisMainPage);
document.querySelector('#delPage').addEventListener('click', pageDelCheck);
document.querySelector('#notifyPage').addEventListener('click', toggleNotiPage);
document.querySelector('#copyLink').addEventListener('click', creLink);

document.querySelector('#lockPg').addEventListener('click', pageLock);

document.querySelector('#menuImg').addEventListener('click', function (e) {
    pageMenuSetting();
    areUTurnOn();
});

let headerMenu = document.querySelector('#ulMenu');
headerMenu.addEventListener('click', async function (e) {
    headerMenu.classList.toggle('hide');
    headerMenu.classList.toggle('view');
})


//기본 페이지 메뉴 세팅.
async function pageMenuSetting() {

    let memberAuth = await memberCheck(workBlockId);

    console.log(memberAuth);

    if (memberAuth == 'OWNER' || memberAuth == 'MANAGER') {

        document.querySelector('#mainPage').classList.remove('hide');
        document.querySelector('#lockPg').classList.remove('hide');
        document.querySelector('#notiLockPg').classList.add('hide');

    } else if (memberAuth == 'NOMAL') {
        document.querySelector('#mainPage').classList.add('hide');
        document.querySelector('#lockPg').classList.add('hide');
        document.querySelector('#notiLockPg').classList.remove('hide');

    }
}


//페이지 정보 가져오는거(필요없어지면지움)
async function pageInfoFromMenu() {

    let url = "/pageInfo?pageId=" + pageBlockId;
    let info;

    await fetch(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((result) => {
            info = result;
        });

    return info;
}


//페이지 잠금(소유자/관리자)
async function pageLock() {

    let lockCheck;

    let infos = await pageInfoFromMenu();
    console.log(infos);
    for (let info of infos) {
        console.log(info);
        if (info.lockCheck == 'FALSE') {
            lockCheck = 'TRUE';
        } else if (info.lockCheck == 'TRUE') {
            lockCheck = 'FALSE';
        }
    }

    let url = '/pageLock';
    let val = {
        lockCheck,
        "pageId": pageBlockId
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
        })
        .catch(err => console.log(err));

}

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

    let val = {
        "pageId": pageBlockId,
        "workId": workBlockId
    }

    let url = '/pageDelCheck';

    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(val)
    })
        .then(response => response.text())
        .then(result => {
            if (result == 'true') {
                alert('페이지가 삭제되었습니다.')
            } else if (result == 'false') {
                alert('페이지가 삭제되지 않았습니다. 다시 시도하십시오.');
            }
        })
        .catch(err => console.log(err));
}

//현재 페이지를 메인 페이지로 등록(소유자, 관리자?)
//워크스페이스 아이디 불러오고, 페이지 url가져오는거 해야함.
function ThisMainPage() {

    let val = {
        "mainPageId": pageBlockId,
        "workId": workBlockId
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
            if (result == 'true') {
                alert('현재 페이지가 메인 페이지로 등록되었습니다.')
            } else if (result == 'false') {
                alert('유효하지 않은 요청입니다.. 다시 시도하십시오.');
            }
        })
        .catch(err => console.log(err));
}


//페이지 알림 끄기
function toggleNotiPage() {
    let url = '/pageNotify';
    let email = document.querySelector("#side input.logUser").value;

    let val = {
        "pageId": pageBlockId,
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
            if (result == '0') {
                alert('페이지 알림이 켜졌습니다.')
                areUTurnOn();
            } else if (result == '1') {
                alert('페이지 알림이 꺼졌습니다.')
                areUTurnOn();
            }
        })
        .catch(err => console.log(err));
}

//페이지 알림 끄고켜는거...
function areUTurnOn() {
    let email = document.querySelector("#side input.logUser").value;

    let url = `/pageNotify?pageId=${pageBlockId}&email=${email}`;

    fetch(url, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(result => {
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
//현재 execCommand는 사용되지 않는데 대체인 클립보드 api가 로컬호스트나 https 환경에서만 사용이 가능하다고 해서...
//배포 환경을 여쭤보고 수정하던지 하는 게 나을듯
async function creLink() {

    let info = await pageInfoFromMenu();
    if (info.publicCheck == 'P_PRIV') {
        alert('이 페이지는 공유할 수 없습니다.');
    } else {

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
}

//페이지 복사
