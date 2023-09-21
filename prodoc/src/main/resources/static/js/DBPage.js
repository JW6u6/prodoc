window.addEventListener("DOMContentLoaded", (e) => {
	getDBPageList();
});

const dataList = document.getElementById("dataList");
const pageList = [];											// fetch로 받은 페이지 리스트 저장
const casePageInfo = {"pageId" : "", "caseId" : "DB_LIST"};		// 케이스 페이지 정보
const stateType = ['WAIT', 'RUN', 'END', 'CANCLE'];             // 상태 속성에 들어갈 수 있는 값

// DB 레이아웃 체인지 이벤트
document.querySelectorAll(".change-layout li").forEach(tag => {
    tag.addEventListener("click", function(e){
        let layout = e.currentTarget.getAttribute("id");
        listLayoutChange(layout);
    });
});

// 날짜 선택
let dateBtn = document.getElementById("getSearchDate");
dateBtn.addEventListener("click", function(e){
    let dateView = document.getElementById("selectDate");
    if(dateView.style.display == 'none') dateView.style.display = 'inline-block';
    else dateView.style.display = 'none';
});

// 날짜 삭제
function addDelBtn(){
    if(dateBtn.textContent == '날짜') return;
    let delBtn = document.createElement("button");
    delBtn.textContent = "x";
    dateBtn.append(delBtn);
    
    delBtn.addEventListener("click", function(e){
        dateBtn.textContent = "날짜";
        startDate.value = "";
        endDate.value = "";
        endDate.disabled = true;
    })
}

// 날짜 입력
let endDate = document.getElementsByName("endDate")[0];
let startDate = document.getElementsByName("startDate")[0];

startDate.addEventListener("change", function(e){
    if(startDate.value != "") {
        endDate.removeAttribute("disabled");
        endDate.value = startDate.value;
        endDate.setAttribute("min", startDate.value);
        dateBtn.textContent = startDate.value;
        addDelBtn();
    }
});

endDate.addEventListener("change", function(e){
    if(endDate != ""){
        dateBtn.textContent = startDate.value + ' ~ ' + endDate.value;
        addDelBtn();
    }
})

function getDBPageList(){
	pageList.length = 0;		//기존 데이터 비우기
	// 페이지 아이디, 페이지 케이스 같이 넘겨주기
	
    fetch("getDBPageList",{
        method : "post",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({ 'pageId' : 'nni8c-c3s9s-1thlvm'})
    })
    .then(response => {
        return response.json();
    })
    .then(result => {
        result.forEach(item => {
            pageList.push(item);
        })
        console.log(pageList);
    })
    .catch(err => console.log(err))
}