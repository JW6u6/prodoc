//히스토리 창 열기
let historyModal = document.querySelector("#modHistory");
document.querySelector("#history")
.addEventListener('click', function(e){
	if(historyModal.className == "hide"){
		historyModal.className = "view"
		SearchHistory();
	}else 
		historyModal.className = "hide"
});



let hStartDate = document.querySelector("#modHistory input[name='startDate']");
let hEndDate = hStartDate.nextElementSibling;

//startDate 최소 날짜 세팅
function hisMinDate(){
	let fifteen = new Date(new Date() - 1296000000);	//오늘로부터 15일 전
	let year = fifteen.getFullYear();
	let month = (fifteen.getMonth() + 1) >= 10 ? 
				(fifteen.getMonth() + 1) : "0" + (fifteen.getMonth() + 1);
	let date = fifteen.getDate() >= 10 ? fifteen.getDate() : "0"+fifteen.getDate();
	let minDate = `${year}-${month}-${date}`;

	hStartDate.min = minDate;
}

//endDate 최소 날짜 세팅
hStartDate.addEventListener('change', function(e){
	hEndDate.disabled = false;
	hEndDate.min = this.value;
});

//검색 날짜 초기화
document.querySelector('#hisResetBtn')
.addEventListener('click', function(e){
	hStartDate.value = "";
	hEndDate.value = "";
	hEndDate.disabled = true;
});



//검색 버튼 클릭
document.querySelector('#hisSearchBtn').addEventListener('click', SearchHistory);


//검색 프로세스
function SearchHistory(){
	let hisList = {};
	let logUser = document.querySelector("#UserInfoMod p.email");
	hisList.logUser = logUser.innerText;
	hisList.select = document.querySelector("#modHistory select").value;
	if(hEndDate.value < hStartDate.value){
		hEndDate.value = "";
	}
	hisList.startDate = hStartDate.value;
	hisList.endDate = hEndDate.value;
	console.log(hisList);
	
	fetch("/history",{
		method: "post",
		body: JSON.stringify(hisList),
		headers: {'content-Type' : 'application/json'}
	}).then(response => response.json())
	.then(result => {
	console.log(result);
	settingHistoryResult(result.historyList);
	}).catch(err => console.log(err));
}


function formatDate(thisDate){
	let year = thisDate.getFullYear();
	let month = (thisDate.getMonth() + 1) >= 10 ? 
				(thisDate.getMonth() + 1) : "0" + (thisDate.getMonth() + 1);
	let date = thisDate.getDate() >= 10 ? thisDate.getDate() : "0"+thisDate.getDate();
	return `${year}-${month}-${date}`;
}

//결과 세팅
function settingHistoryResult(history){
	console.log(history);
	let resultList = document.querySelector(".historyList");
	resultList.innerHTML = "";
	if(history.length == 0){
		resultList.innerHTML = `<div class="historyItem" style="overflow:hidden; 
		border:1px solid black;"><h2>삭제 목록이 없습니다.</h2></div>`;
		return;
	}//검색 결과가 없음
	
	for(let i=0; i<history.length; i++){
		//일자 구분선
		if(i != 0){
			let thisDate = new Date(history[i].upDate);
			let beforeDate = new Date(history[i-1].upDate);
			if(thisDate.date == beforeDate.date){
				let dateLine = `<div style="float:left">${formatDate(thisDate)}
								<div style="float:left"><hr></div></div>`;
			}
			resultList.innerHTML += dateLine;
			
		}else{
			let dateLine = `<div><h3 style="float:left; width:17%">${formatDate(new Date(history[i].upDate))}</h3>
							<hr style="float:left; width:70%; margin:auto 0px;"></div>`;
			resultList.innerHTML += dateLine;
		}

		let historyDIV = "";
		
		
		if(list.pageName != null){
			historyDIV = `<div class="historyItem" data-history="${list.historyId}" style="overflow:hidden; border:1px solid black;">
							<div style="width:90%; float:left">
								<p>${list.workName}</p>
								<h2>${list.pageName}</h2>
								<p>${list.workName} / ${(list.upDate).substr(0,10)}</p>
							</div>
							<div style="width:10%; float:left">
								<button type="button" class="revokeBtn">복구</button>
							</div>
						</div>`;
		}else{
			historyDIV = `<div class="historyItem" data-history="${list.historyId}" style="overflow:hidden; border:1px solid black;">
							<div style="width:90%; float:left">
								<h2>${list.workName}</h2>
								<p>${list.workName} / ${(list.upDate).substr(0,10)}</p>
							</div>
							<div style="width:10%; float:left">
								<button type="button" class="revokeBtn">복구</button>
							</div>
						</div>`;
		}
		resultList.innerHTML += historyDIV;
	}
	
	
	
	
	document.querySelectorAll(".revokeBtn").forEach(btn =>{
		btn.addEventListener('click', function(e){
			let parent = this.closest('div.historyItem');
			revokeFcn(parent.dataset.history);	//복구 이벤트
		});
	});
}



//TODO: 복구 프로세스 ajax
function revokeFcn(historyId){
	console.log(historyId);
	//fetch("/revokeTrash",{
	//	method: 'post',
	//	body: { "historyId" : historyId },
	//	headers: {"Content_type" : "application/json"}
	//})
	//.then()
	//.then()
	//.error(err=>console.log(err));
}