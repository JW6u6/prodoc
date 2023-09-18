init();



function init() {
    workList();
    pageList();
    document.querySelector('#wsCreate').addEventListener('click', newWorkSpace);
}
let wsCount = 0;

function newWork() {
    wsCount += 1;
    let element = event.currentTarget.nextElementSibling;
    workModal.style.display = "block";
    document.body.style.overflow = "hidden";
    element.innerHTML += '<div class= "Work">' + wsCount + ' <span onclick="newPage()" class="add">➕</span> <div>'
}

function newPage() {
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    event.currentTarget.nextElementSibling.innerHTML += '<div class = "Page">페이지<span onclick="newSubPage()" class="add">➕</span> <div>'
}

function newSubPage() {
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    event.currentTarget.nextElementSibling.innerHTML += '<div class = "Page">페이지<span onclick="newSSPage()" class="add">➕</span> <div>'
}

function closeModal() {
    workModal.style.display = "none";
    pageModal.style.display = "none";
    document.body.style.overflow = "auto"
}
function template(){
    temPage.style.display = "block";
    pageCont.style.display = "none";
    dbPage.style.display = "none";
}
function database(){
    dbPage.style.display = "block";
    pageCont.style.display = "none";
    temPage.style.display = "none";
}
function selectTemp(){
    // let selId = event.currentTarget.id;
    $('#caseId').val("temp")
}
function selectDb(){
    // let selId = event.currentTarget.id;
    $('#caseId').val("db")
}
// function selectList(){
//     fetch("http://localhost:8099/workList")
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((error) => console.log(error));
// }
function workList() {
    $.ajax("/workList")
        .done(data => {
            $.each(data, function (idx, obj) {
                let side = $('#side');
                let wName = obj;
                let text = '<div class= "Work">' + wName + ' <span onclick="newPage()" class="add">➕</span> <div>'
                side.append(text);
            })
        })
    .done(data =>{
        $.each(data, function(idx,obj){
            let side = $('#side');
            let wId = obj;
            let text = '<div class= "Work">' + '<span class = "workVal">' + wId +'</span>' + ' <span onclick="newPage()" class="add">➕</span> <div>'
            side.append(text);
            
        })
        work = $('.Work')
        work.on('click',function(event){
            let wId = event.currentTarget.firstElementChild.innerText;
            selectWork(wId);
        })
    })
    .fail(reject => console.log(reject))
}
function workInsert(){
    let workObj = formDataObj("form");
    $.ajax({
        url : "/workInsert",
        type : "post",
        data : workObj,
    })
    .done((result)=>{
        if(result != null){
            console.log(result);
        }
    })
    .fail((reject) =>{
        console.log(reject);
    })
}
function formDataObj(formTag){
    let formData = $(formTag).seriallizeArray();
    let formObj = {};
    $.each(formData, function(idx,obj){
        formObj[obj.name] = obj.value;
    })
    return formObj;
}
function selectWork(wId){
    $.ajax("/workList")
    .done(data =>{
        // for(let works in data){
        //     
        // }
        for(let i=0;i<data.length;i++){
            if(data[i]==wId){
                let content = $('.pageCont');
                let text = '<div class= "conts">'+data[i]+'</div>';
                content.append(text);
                $('#workId').val(data[i]);

            }
        }

    })
}

function pageList() {
    $.ajax("/pageList")
        .done(data => {
            let page = ""
            $.each(data, function (idx, obj) {
                let side = $('#side');
                let pId = obj;
                let text = '<div class= "Page">' + '<span class = "pageVal" >' + pId + '</span>' + ' <span onclick="newPage()" class="add">➕</span> <div>'
                side.append(text);
            })
            page = $('.Page')
            page.on('click', function (event) {
                let pId = event.currentTarget.firstElementChild;
                selectPage(pId.innerText);
            })
        })
=======
        page = $('.Page')
        page.on('click',function(event){
            let pId = event.currentTarget.firstElementChild;
            selectPage(pId.innerText);
           
        })
    })
}

function selectPage(pId) {
    $.ajax({
            url: "/pageInfo",
            type: "get",
            data: {
                pageId: pId
            }
        })
        .done(data => {
            console.log(data);
            for (let emp in data) {
                let content = $('.content');
                let text = '<div class= "conts">' + emp + '</div>';
                content.append(text);
            }
        })
        .fail(reject => console.log(reject))
        url : "/pageInfo",
        type: "get",
        data: { pageId : pId}
    })
    .done(data => {
        for(let field in data){
            if(data[field]==pId){
               $('#pageId').val(data[field]);
               console.log(data[field]);
            }
        }
    })
    .fail(reject => console.log(reject))
}

function insertPage(){
    $.ajax({
        url : "/pageInsert",
        type : "post",
        data : { workId : wId }
    })
    .done(data => {

    })
    .fail(reject => console.log(reject))
}
let wId = $('#workId')
let wt = document.querySelector("#wsType");
let ta = document.querySelector("#typeArrow");
wt.addEventListener("click", (e) => {
    ta.classList.toggle("turn");
})
wt.addEventListener("focusout", (e) => {
    ta.classList.remove("turn");
})

let wp = document.querySelector("#wsPrivate");
let pa = document.querySelector("#priArrow");
wp.addEventListener("click", (e) => {
    pa.classList.toggle("turn");
})
wp.addEventListener("focusout", (e) => {
    pa.classList.remove("turn");
})

//새 워크스페이스 생성
function newWorkSpace(){

    let type = document.querySelector('#wsType');
    let pCheck = document.querySelector('#wsPrivate');
    let email = document.querySelector('#loginUser').value;
    console.log(email);
    let val = {
        'workType' : type.options[type.selectedIndex].value,
        'workName' : document.querySelector('#wsName').value,
        'publicCheck' : pCheck.options[pCheck.selectedIndex].value,
        'email' : email
    };
    console.log(val);
    let url = '/workInsert';

    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(val)
    })
    .then(response => console.log(response))
    .catch(err => console.log(err));
}

//워크스페이스 타입별 select option 구분 / 초대 부분 노출여부
document.querySelector('#wsType').addEventListener('change', function(e){
        let invite = document.querySelector('#inviteUser'); //초대 부분
        let memberOption = document.querySelector('#memOption'); //멤버공개옵션(팀)
        let privateOption = document.querySelector('#privOption'); //비공개옵션(개인)
    if(e.target.value == 'TEAM'){
        invite.classList.remove('hide');
        memberOption.classList.remove('hide');
        privateOption.classList.add('hide');
    }else{
    	invite.classList.add('hide');
        memberOption.classList.add('hide');
        privateOption.classList.remove('hide');
    }
});

let invBtn = document.querySelector('#inviteBtn');

invBtn.addEventListener('click', function(e){
    let mail = document.querySelector('#invEmail');
    let trTag = document.createElement('tr');
    let tdTag = document.createElement('td');
    tdTag.textContent = mail.value;

    trTag.appendChild(tdTag);
    document.querySelector('#invList').appendChild(trTag);

    mail.value = '';
});
