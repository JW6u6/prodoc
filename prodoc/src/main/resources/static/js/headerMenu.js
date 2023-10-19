//나중에 따로 다른데로 옮기던가 해도 괜찮을거같은데...(이걸 왜 여기서?하고있지?)
document.querySelector('#mainPage').addEventListener('click', ThisMainPage);
document.querySelector('#delPage').addEventListener('click', pageDelCheck);
// document.querySelector('#notifyPage').addEventListener('click', toggleNotiPage);
document.querySelector('#copyLink').addEventListener('click', creLink);
document.querySelector('#notiLockPg').addEventListener('click', alreadyLock);
document.querySelector('#copyPage').addEventListener('click', copyPagstePage);

document.querySelector('#lockPg').addEventListener('click', pageLock);

document.querySelector('#menuImg').addEventListener('click', function (e) {
    let clickClose = document.createElement('div');
    document.body.appendChild(clickClose);
    clickClose.addEventListener('click', function (e) {
        headerMenu.classList.toggle('hide');
        headerMenu.classList.toggle('view');
        clickClose.remove();
    })
    pageMenuSetting();
    // areUTurnOn();
    areULock();
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
            if (lockCheck == 'TRUE') {
                alert('페이지 잠금이 설정되었습니다.');
                areULock();
            } else if (lockCheck == 'FALSE') {
                alert('페이지 잠금이 해제되었습니다.');
                areULock();
            } else if (result == 'FALSE') {
                alert('페이지 잠금 설정에 실패했습니다.');
            }
        })
        .catch(err => console.log(err));

}

function alreadyLock() {
    let url = '/areULOCK?pageId=' + pageBlockId;

    fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result > 0) {
                alert('이미 해당 페이지의 잠금이 요청되었습니다.')
            } else {
                pageLockNoti();
            }
        })
        .catch(err => console.log(err));
}

//페이지 잠금해제 요청(일반 사용자)
async function pageLockNoti() {
    let infos = await pageInfoFromMenu();
    let lockCheck;

    let url = '/LockNotify';
    for (let info of infos) {
        if (info.lockCheck == 'FALSE') {
            lockCheck = 'FALSE';
        } else if (info.lockCheck == 'TRUE') {
            lockCheck = 'TRUE';
        }
    }

    fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "pageId": pageBlockId
            })
        })
        .then(response => response.text())
        .then(result => {
            if (lockCheck == 'FALSE') {
                alert('페이지 잠금 요청을 보냈습니다.');
            } else if (lockCheck == 'TRUE') {
                alert('페이지 잠금 해제 요청을 보냈습니다.');
            }
        })
        .catch(err => console.log(err));
}

//페이지 삭제 체크
async function pageDelCheck() {
    let infoResult = await selectOneWork(workBlockId);
    let home = document.querySelector('#homePg');
    let infos = await pageInfoFromMenu();
    let dbCheck = false;

    for (let info of infos) {
        if (info.caseId.indexOf('DB') == -1) {
            dbCheck = false;
        } else if (info.caseId.indexOf('DB') != -1) {
            dbCheck = true;
        }
    }

    if (dbCheck == true) {
        pageBlockId = '';
    } else if (home.value == pageBlockId) {
        alert('홈은  삭제할 수 없습니다.');

    } else if (infoResult.mainPageId == pageBlockId) {
        alert('메인 페이지는 삭제할 수 없습니다.')

    } else if (infoResult.mainPageId != pageBlockId) {

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
                    let email = document.querySelector("#side input.logUser").value;
                    alert('페이지가 삭제되었습니다.')
                    allList(email);
                } else if (result == 'false') {
                    alert('페이지가 삭제되지 않았습니다. 다시 시도하십시오.');
                }
            })
            .catch(err => console.log(err));
    }
}

//현재 페이지를 메인 페이지로 등록(소유자, 관리자?)
async function ThisMainPage() {
    let infoResult = await selectOneWork(workBlockId);
    if (infoResult.mainPageId == pageBlockId) {
        alert('이 페이지는 이미 메인페이지입니다.')
    } else if (infoResult.mainPageId != pageBlockId) {
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
}


// //페이지 알림 끄기
// function toggleNotiPage() {
//     let url = '/pageNotify';
//     let email = document.querySelector("#side input.logUser").value;

//     let val = {
//         "pageId": pageBlockId,
//         email
//     }

//     fetch(url, {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(val)
//         })
//         .then(response => response.text())
//         .then(result => {
//             console.log(result);
//             if (result == '0') {
//                 alert('페이지 알림이 켜졌습니다.')
//                 areUTurnOn();
//             } else if (result == '1') {
//                 alert('페이지 알림이 꺼졌습니다.')
//                 areUTurnOn();
//             }
//         })
//         .catch(err => console.log(err));
// }

// //페이지 알림 끄고켜는거...
// function areUTurnOn() {
//     let email = document.querySelector("#side input.logUser").value;

//     let url = `/pageNotify?pageId=${pageBlockId}&email=${email}`;

//     fetch(url, {
//             method: 'get',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then(response => response.text())
//         .then(result => {
//             let notiToggle = document.querySelector('#notifyPage');
//             if (result == 0) {
//                 notiToggle.textContent = '페이지 알림 끄기';
//             } else if (result == 1) {
//                 notiToggle.textContent = '페이지 알림 켜기';
//             }
//         })
//         .catch(err => console.log(err));
// }

async function areULock() {
    let infos = await pageInfoFromMenu();
    let LockToggle = document.querySelector('#lockPg');
    let LockNotiToggle = document.querySelector('#notiLockPg');
    let displayedBlock = document.querySelectorAll(".prodoc_block");
    
    for (let info of infos) {
        if (info.lockCheck == 'FALSE') {
            LockToggle.textContent = '페이지 잠금 설정';
            LockNotiToggle.textContent = '페이지 잠금 요청';
            for (let block of displayedBlock) {
                let targetblock = block.lastElementChild.firstElementChild;
                targetblock.removeAttribute('disabled');
            }
        } else if (info.lockCheck == 'TRUE') {
            LockToggle.textContent = '페이지 잠금 해제';
            LockNotiToggle.textContent = '페이지 잠금 해제 요청';
            for (let block of displayedBlock) {
                let targetblock = block.lastElementChild.firstElementChild;
                targetblock.setAttribute('disabled', 'true');
            }
        }
    }
}

//링크복사
async function creLink() {

    let info = await selectOneWork(workBlockId);
    let pubCheck = false;

    if (info.publicCheck == 'W_PRIV') {
        pubCheck = false;
    } else if (info.publicCheck == 'W_PUB' || info.publicCheck == 'W_MEM') {
        pubCheck = true;
    }

    if (pubCheck == false) {
        alert('이 페이지는 공유할 수 없습니다.');
    } else {
        let url = ''; // <a>태그에서 호출한 함수인 clip 생성
        let linkText = document.createElement("textarea");
        //url 변수 생성 후, textarea라는 변수에 textarea의 요소를 생성
        document.body.appendChild(linkText);
        url =
            'http://prodox.me/shared/'
            // 'http://localhost:8099/shared/'
            + pageBlockId;
        linkText.value = url; // textarea 값에 url를 넣어줌

        if (navigator.clipboard !== undefined) {
            navigator.clipboard
                .writeText(linkText.value)
                .then(() => {
                    alert('링크가 복사되었습니다.');
                    linkText.remove();
                })

        } else {
            linkText.select(); //textarea를 설정
            document.execCommand("copy"); // 복사
            console.log(linkText);
            alert("링크가 복사되었습니다.") // 알림창
            linkText.remove();
        }
    }
}

//페이지 복사
function copyPagstePage() {
    let url = '/pageCopyPaste';
    let email = document.querySelector("#side input.logUser");
    if (email.value == '') {
        alert('세션이 만료되었습니다. 다시 로그인 해주십시오.')
    } else {
        let val = {
            "pageId": pageBlockId,
            "email": email.value
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
                if (result == 'SUCCESS') {
                    alert('페이지가 복사되었습니다.');
                } else if (result == 'FAIL') {
                    alert('복사할 수 없는 블록이 포함되어있습니다.');
                }
            })
            .catch(err => console.log(err));
    }
}