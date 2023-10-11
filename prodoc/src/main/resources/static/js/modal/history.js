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

function formatTime(thisDate){
	let hour = thisDate.getHours() >= 10? thisDate.getHours() : '0'+thisDate.getHours();
	let minute = thisDate.getMinutes() >= 10? thisDate.getMinutes() : '0'+thisDate.getMinutes();
	let second = thisDate.getSeconds() >= 10? thisDate.getSeconds() : '0'+thisDate.getSeconds();
	
	return `TIME: ${hour}:${minute}:${second}`;
}

//결과 세팅
function settingHistoryResult(history){
	console.log(history);
	let resultList = document.querySelector(".historyList");
	resultList.innerHTML = "";
	if(history.length == 0){
		resultList.innerHTML = `<div class="historyItem" style="overflow:hidden; 
		border:1px solid black;"><h2>히스토리 내역이 없습니다.</h2></div>`;
		return;
	}//검색 결과가 없음
	
	for(let i=0; i<history.length; i++){//히스토리 내역 순회
		//일자 구분선
		if(i != 0){	//첫 데이터가 아님
			let thisDate = new Date(history[i].upDate);
			let beforeDate = new Date(history[i-1].upDate);
			if(thisDate.getDate() != beforeDate.getDate()){
				let dateLine = `<div style="overflow: hidden"><h3 style="float:left">${formatDate(thisDate)}</h3>
								<div><hr></div></div>`;
				resultList.innerHTML += dateLine;
			}
		}else{		//첫 데이터임
			let dateLine = `<div style="overflow: hidden"><h3 style="float:left">${formatDate(new Date(history[i].upDate))}</h3>
								<div><hr></div></div>`;
			resultList.innerHTML += dateLine;
		}
		
		//일자별 히스토리
		let historyDIV = "";
		if(history[i].pageId != null){	//페이지에 관한 히스토리
			historyDIV = `<div class="historyItem" data-workid="${history[i].workId}"
							data-pageid="${history[i].pageId}" data-blockid="${history[i].displayId}"
							style="overflow:hidden; border:1px solid black; margin:5px 0px">
							<div style="width:20%; float:left">
						        <p>${history[i].historyType}</p>
						        <p>${formatTime(new Date(history[i].upDate))}</p>
						    </div>
						    <div style="width:70%; float:left">
						        <p>페이지</p>
						        <h3>${history[i].pageName}<span>(${history[i].workName})</span></h3>
						        <p>${history[i].nickname}(${history[i].creUser})</p>
						    </div>`;
			if(history[i].historyType == 'DELETE'){
				historyDIV += ` <div float:left"><button type="button" class="revokeBtn">복구</button></div>`;
			}
				historyDIV += `</div>`;
		}else{							//워크에 관한 히스토리
			historyDIV = `<div class="historyItem" data-workid="${history[i].workId}" 
							style="overflow:hidden; border:1px solid black; margin:5px 0px">
							<div style="width:20%; float:left">
						        <p>${history[i].historyType}</p>
						        <p>${formatTime(new Date(history[i].upDate))}</p>
						    </div>
						    <div style="width:70%; float:left">
						    	<p>워크스페이스</p>
						        <h3>${history[i].workName}</h3>
						        <p>${history[i].nickname}(${history[i].creUser})</p>
						    </div>`
						    
			if(history[i].historyType == 'DELETE'){
				historyDIV += ` <div float:left"><button type="button" class="revokeBtn">복구</button></div>`;
			}
			historyDIV += `</div>`;
		}
		
		resultList.innerHTML += historyDIV;
	} //결과 세팅 끝
	
	//이동 이벤트
	document.querySelectorAll("div.historyItem").forEach( divTag => {
		if(divTag.children.length == 2){	//복구 버튼이 없는 div만 이동 이벤트
			divTag.addEventListener('click', goPageBlock);
		}
	})
	
	
	//복구 이벤트
	document.querySelectorAll(".revokeBtn").forEach(btn =>{
		btn.addEventListener('click', function(e){
			let parent = this.closest('div.historyItem');
			revokeFcn(parent.dataset.workid, parent.dataset.pageid);
		});
	});
}


function goPageBlock(e){	//TODO: 클릭 시 로우 이동 후
	if(e.currentTarget.dataset.blockid == null)  return;	//blockid가 없으면 이벤트x
	
	if(e.currentTarget.dataset.pageid == null)   return;
	
	
	selectPage(e.currentTarget.dataset.pageid);
	//showBlocks(e.currentTarget.dataset.pageid);
	
	let blockId = `div[data-block-id="${e.currentTarget.dataset.blockid}]"`;
	let focusBlock = document.querySelector(blockId);
	window.scrollTo({top:focusBlock, behavior:'smooth'});	
	historyModal.className = "hide";
	
}


function revokeFcn(workId, pageId){ //TODO: 복구 프로세스 ajax
	//console.log(workId +" --- "+pageId);
	let obj = {};
	obj.workId = workId;
	obj.pageId = pageId;
	fetch("/revokeTrash",{
		method: 'post',
		body: JSON.stringify(obj),
		headers: {'content-Type' : 'application/json'}
	}).then(response => response.json())
	.then(result=>{
		console.log(result.msg);
		alert(result.msg);
		workList(result.logUser);
		//historyModal.className = "hide";
	}).catch(err=>console.log(err));
}