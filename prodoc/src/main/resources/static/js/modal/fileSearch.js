//모달창 열었을 때 전체 파일 조회
let data = {};
getAllList(data);

//이벤트 등록
document.getElementById("fileSearchBtn").addEventListener("click", getSearchList);
document.getElementById("fileList").addEventListener("click", function(e){
   let FileModal = document.getElementById("FileSearchModal");
   if(FileModal.className == "hide"){
      FileModal.className = "view";
   } else {
      FileModal.className = "hide";
   }
});

// 전체 선택 체크박스
const checkInput = document.querySelectorAll("input[name='searchOption']");
document.getElementById("checkAll").addEventListener("click", function(e){
    checkInput.forEach(tag => {
        if(e.target.checked == false) tag.checked = false;
        else tag.checked = true;
    })
});

checkInput.forEach(tag => {
    tag.addEventListener("change", function(e){
        if(tag.checked == false) document.getElementById("checkAll").checked = false;
    })
});

// 날짜 버튼 클릭으로 input date 활성화
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

endDate.nextElementSibling.addEventListener("click", function(e){
    startDate.disabled = !startDate.disabled;
    endDate.disabled = !endDate.disabled;
});

// 날짜 포멧 변경
function changeDate(dbDate){
   let date = new Date(dbDate);
   let year = date.getFullYear();
   let month = ('0' + (date.getMonth() + 1)).slice(-2);
   let day = ('0' + date.getDate()).slice(-2);
   
   return `${year}-${month}-${day}`;
};

// 날짜 검색 조건
startDate.addEventListener("change", function(e){
    if(startDate.value != "") {
        endDate.removeAttribute("disabled");
        endDate.value = startDate.value;
        endDate.setAttribute("min", startDate.value);
    }
});


// 목록 조회 AJAX --------------------------------------------------------------------------------------------
function getAllList(searchData){
    let fileSearchList = document.querySelector("#fileSearchList tbody");
    fileSearchList.innerHTML = "";       
   
    fetch("getFileList", {
        method : "post",
        headers : {
           "Content-Type" : "application/json"
      },
      body : JSON.stringify(searchData)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        let fileList = result;

        // 태그 생성
        for(let file of fileList){
            let trTag = document.createElement("tr");
            for(let field in file){
               let value = file[field];
                if(field == 'displayId'){
                   trTag.setAttribute('id', file[field]);
                    trTag.addEventListener("click", moveToFileblock);
                   continue;
                };
                if(field == 'saveDate') value = changeDate(value);
                let tdTag = document.createElement("td");
                tdTag.innerText = value;
                if(field == 'pageId'){
                   tdTag.classList.add("pidToFile");
                    tdTag.innerText = file[field];
                };
                trTag.append(tdTag);
                if(field == 'workName' || field == 'workId' || field == 'pageId'){
                   tdTag.style.display = 'none';
                }
            }
            fileSearchList.append(trTag);
        }

    })
    .catch(err => console.log(err))
}

// 검색 이벤트
function getSearchList(e){
    let searchData = {}

    searchData['keyword'] = document.querySelector("input[name='searchWord']").value;  //검색어
    let searchDate = document.querySelectorAll("input[name='searchDate']");     //날짜정보

    // 날짜 태그의 value 가져오기
    for(let date of searchDate){
      console.log(date);            
       if(date.disabled == true) continue;
      let field = date.getAttribute("id");
      searchData[field] = date.value;
    }

    for(let tag of checkInput){
       let field = tag.getAttribute("value");
       searchData[field] = tag.checked;
    }
    
    console.log(searchData);
    getAllList(searchData);
    
}

// trTag 클릭 이벤트 : fileInfo
function moveToFileblock(e){
   const displayId = e.currentTarget.getAttribute("id");
    const pageId = e.currentTarget.querySelector(".pidToFile").innerText;
   console.log(pageId, displayId);
   if(pageId != '' || pageId != null ) selectPage(pageId);
    if(displayId != '' || displayId != null) cusorMove(displayId);
}