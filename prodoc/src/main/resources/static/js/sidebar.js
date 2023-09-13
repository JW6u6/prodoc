init();



function init(){
    selectList();
}
let wsCount = 0;
function newWork(){
    wsCount += 1;
    let element = event.currentTarget.nextElementSibling
    element.innerHTML += '<div class= "Work">' + wsCount +' <span onclick="newPage()" class="add">➕</span> <div>'
}
function newPage(){
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    // console.log(event.currentTarget.nextElementSibling)
    event.currentTarget.nextElementSibling.innerHTML += '<div class = "Page">페이지<span onclick="newSubPage()" class="add">➕</span> <div>'
}
function newSubPage(){
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    event.currentTarget.nextElementSibling.innerHTML += '<div class = "Page">페이지<span onclick="newSSPage()" class="add">➕</span> <div>'
}
function closeModal(){
    modal.style.display = "none";
    document.body.style.overflow = "auto"
}

// function selectList(){
//     fetch("http://localhost:8099/workList")
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((error) => console.log(error));
// }
function selectList(){
    $.ajax("http://localhost:8099/workList")
    .done(data =>{
        $.each(data, function(idx,obj){
            console.log(obj);
            let side = $('#side');
            for (let i = 0; i < obj.length; i++){
                ele = obj
            }
            let text = '<div class= "Work">' + ele +' <span onclick="newPage()" class="add">➕</span> <div>'
            side.append(text);
        })
    })
}