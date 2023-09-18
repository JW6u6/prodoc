init();



function init(){
    workList();
    pageList();
}
let wsCount = 0;
function newWork(){
    wsCount += 1;
    let element = event.currentTarget.nextElementSibling;
    workModal.style.display = "block";
    document.body.style.overflow = "hidden";
    element.innerHTML += '<div class= "Work">' + wsCount +' <span onclick="newPage()" class="add">➕</span> <div>'
}
function newPage(){
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    // console.log(event.currentTarget.nextElementSibling)
    event.currentTarget.nextElementSibling.innerHTML += '<div class = "Page">페이지<span onclick="newSubPage()" class="add">➕</span> <div>'
}
function newSubPage(){
    pageModal.style.display = "block";
    document.body.style.overflow = "hidden";
    event.currentTarget.nextElementSibling.innerHTML += '<div class = "Page">페이지<span onclick="newSSPage()" class="add">➕</span> <div>'
}
function closeModal(){
    workModal.style.display = "none";
    pageModal.style.display = "none";
    document.body.style.overflow = "auto"
}

// function selectList(){
//     fetch("http://localhost:8099/workList")
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((error) => console.log(error));
// }
function workList(){
    $.ajax("/workList")
    .done(data =>{
        $.each(data, function(idx,obj){
            let side = $('#side');
            let wName = obj;
            let text = '<div class= "Work">' + wName +' <span onclick="newPage()" class="add">➕</span> <div>'
            side.append(text);
        })
    })
}
function pageList(){
    $.ajax("/pageList")
    .done(data =>{
        let page = ""
        $.each(data, function(idx,obj){
            let side = $('#side');
            let pId = obj;
            let text = '<div class= "Page">' +'<span class = "pageVal" >'+ pId + '</span>'+' <span onclick="newPage()" class="add">➕</span> <div>'
            side.append(text);
        })
        page = $('.Page')
        page.on('click',function(event){
            let pId = event.currentTarget.firstElementChild;
            selectPage(pId.innerText);
        })
    })
}
function selectPage(pId){
    $.ajax({
        url : "/pageInfo",
        type: "get",
        data: { pageId : pId}
    })
    .done(data => {
        console.log(data);
        for(let emp in data){
            let content = $('.content');
            let text = '<div class= "conts">'+emp+'</div>';
            content.append(text);
        }
    })
    .fail(reject => console.log(reject))
}
let wt = document.querySelector("#wsType");
let ta = document.querySelector("#typeArrow");
wt.addEventListener("click",(e)=>{
    ta.classList.toggle("turn");
})
wt.addEventListener("focusout",(e)=>{
    ta.classList.remove("turn");
})

let wp = document.querySelector("#wsPrivate");
let pa = document.querySelector("#priArrow");
wp.addEventListener("click",(e)=>{
    pa.classList.toggle("turn");
})
wp.addEventListener("focusout",(e)=>{
    pa.classList.remove("turn");
})


