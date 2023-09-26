let trashModal = document.querySelector("#modTrash");
document.querySelector("#trashBasket")
.addEventListener('click', function(e){
	if(trashModal.className == "hide"){
		trashModal.className = "view"
		SearchTrash();
	}else 
		trashModal.className = "hide"
});




let tStartDate = document.querySelector("#modTrash input[name='startDate']");
let tEndDate = tStartDate.nextElementSibling;
//startDate 최소 날짜 세팅
function TrashMinDate(){
	let fifteen = new Date(new Date() - 1296000000);	//오늘로부터 15일 전
	let year = fifteen.getFullYear();
	let month = (fifteen.getMonth() + 1) >= 10 ? 
				(fifteen.getMonth() + 1) : "0" + (fifteen.getMonth() + 1);
	let date = fifteen.getDate() >= 10 ? fifteen.getDate() : "0"+fifteen.getDate();
	let minDate = `${year}-${month}-${date}`;

	tStartDate.min = minDate;
}

//tEndDate 최소 날짜 세팅
tStartDate.addEventListener('change', function(e){
	tEndDate.disabled = false;
	tEndDate.min = this.value;
});

//검색 날짜 초기화
document.querySelector('#trashResetBtn')
.addEventListener('click', function(e){
	tStartDate.value = "";
	tEndDate.value = "";
	tEndDate.disabled = true;
});




//검색 버튼 클릭
document.querySelector('#trashSearchBtn').addEventListener('click', SearchTrash);

//검색 프로세스
function SearchTrash(){
	let trashList = {};
	let logUser = document.querySelector("#UserInfoMod p.email");
	trashList.logUser = logUser.innerText;
	trashList.keyword = document.querySelector("#trashKey").value;
	trashList.select = document.querySelector("#modTrash input[type='radio']:checked").value;
	if(tEndDate.value < tStartDate.value){
		tEndDate.value = "";
	}
	trashList.startDate = tStartDate.value;
	trashList.endDate = tEndDate.value;
	console.log(trashList);
	
	fetch("/trash",{
		method: "post",
		body: JSON.stringify(trashList),
		headers: {'content-Type' : 'application/json'}
	}).then(response => response.json())
	.then(result => {
	console.log(result);
	settingTrashResult(result.trashList);
	}).catch(err => console.log(err));
}




//결과 세팅
function settingTrashResult(trash){
	console.log(trash);
	let resultGrid = document.querySelector(".trashResult");
	resultGrid.innerHTML = "";
	if(trash.length == 0){
		resultGrid.innerHTML = `<div class="trashItem" style="overflow:hidden; border:1px solid black;"><h2>삭제 목록이 없습니다.</h2></div>`;
		return;
	}
	for(let list of trash){
		let trashDIV = "";
		
		if(list.pageName != null){
			trashDIV = `<div class="trashItem" data-history="${list.historyId}" style="overflow:hidden; border:1px solid black;">
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
			trashDIV = `<div class="trashItem" data-history="${list.historyId}" style="overflow:hidden; border:1px solid black;">
							<div style="width:90%; float:left">
								<h2>${list.workName}</h2>
								<p>${list.workName} / ${(list.upDate).substr(0,10)}</p>
							</div>
							<div style="width:10%; float:left">
								<button type="button" class="revokeBtn">복구</button>
							</div>
						</div>`;
		}
		resultGrid.innerHTML += trashDIV;
	}
	
	document.querySelectorAll(".revokeBtn").forEach(btn =>{
		btn.addEventListener('click', function(e){
			let parent = this.closest('div.trashItem');
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