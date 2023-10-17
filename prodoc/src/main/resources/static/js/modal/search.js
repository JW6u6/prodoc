//모달창 열기
let WKDBMod = document.querySelector("#modSearchWKDB");	//모달
document.querySelector("#searchWKDB").addEventListener('click', function(e){
	if(WKDBMod.className == "hide"){
		WKDBMod.className = "view"
		settingSearch();
	}
	else WKDBMod.className = "hide"
});

//WORK , DB 검색 토글
let wkdbType = "wk";
let workMd = document.querySelector("#wkDiv");	//work 찾기
let dbMd = document.querySelector("#dbDiv") 	//db 찾기
document.querySelectorAll(".findBtn").forEach((tag,idx) => {	
	tag.addEventListener('click', function(e){
		searchCaseInit(WKDBkeyword);			//키워드 값 지우기
		if(idx == 0){
			wkdbType = "wk";					//wk 찾기
			workMd.className = "view";
			dbMd.className = "hide";
			document.querySelectorAll('input[name="dbOption"]')
			.forEach(item => item.checked = false )
			settingSearch();
		}else{									//db 찾기
			wkdbType = "db";
			workMd.className = "hide";
			dbMd.className = "view";
			settingSearch();
		}
	});
});

function searchCaseInit(item){		//입력값 초기화
	item.value = "";
}

//날짜 검색 활성화
let dateBtn =document.querySelector(".menuDiv button#dateBtn");
dateBtn.addEventListener('click', function(e){
	let startDate = this.closest("div").children[0];
	startDate.disabled = !startDate.disabled;
});

//최대 날짜 세팅
function settingDates(){
	let today = new Date();
	let year = today.getFullYear();
	let month = (today.getMonth() + 1) >= 10 ? 
				(today.getMonth() + 1) : "0" + (today.getMonth() + 1);
	let date = today.getDate() >= 10 ? today.getDate() : "0"+today.getDate();
	return `${year}-${month}-${date}`;
}

//최소 날짜 세팅
document.querySelector(".menuDiv input[name='startDate']").addEventListener('change', function(e){
	this.nextElementSibling.disabled = false;
	this.nextElementSibling.min = this.value;
});

//검색 버튼 click 이벤트
document.querySelector("#searchBtn").addEventListener('click', settingSearch);

let WKDBkeyword = document.querySelector('#WKDBkeyworkd');

//검색 조건 설정
function settingSearch(){
	let dataList = {}; let checkList = [];
	let logUser = document.querySelector("#UserInfoMod p.email");
	dataList.logUser = logUser.innerText;
	dataList.keyword = WKDBkeyword.value;
	dataList.type = wkdbType;
	if(wkdbType == 'wk'){			//워크 검색일 때
		document.querySelectorAll('.menuDiv input[name$="Date"]').forEach(tag=> {
			if(!tag.disabled){ 
				dataList[tag.name] = tag.value;
				console.log(tag.value);
			}else searchCaseInit(tag);
		});
	}else{							//디비 검색일 때
		document.querySelectorAll('.menuDiv input[type="checkbox"]:checked').forEach(tag=>{ 
			let obj = {};	obj[tag.value] = 'true';
			checkList.push(obj);
		});
		dataList.check = checkList;
		
		if((checkList.length > 0 && WKDBkeyword.value == "") ||
			(checkList.length == 0 && WKDBkeyword.value != "")
		){
			alert('검색 키워드와 검색 조건을 확인해주세요.');
			return;
		}
	}
	console.log(dataList);
	searchThis(dataList);
}



//검색프로세스
function searchThis(dataList){
	fetch("/SearchWKDB", {
		method: 'post',
		body : JSON.stringify(dataList),
		headers: {'content-Type' : 'application/json'}
	}).then(response => response.json())
	.then(result =>{
		//console.log(result.data);
		let ResultDiv = document.querySelector('.SearchResult');
		ResultDiv.innerHTML = ""; //초기화
		let dataDiv = "";

		for(let list of result.data){
			if(wkdbType == "wk"){	//워크일 때
				dataDiv = `
				<div class="resultItem" data-pageid="${list.pageId}" data-blockid="${list.displayId}">
						<div>
							<span>최종수정일</span>
							<span>${list.displayUpDate == null? formatDate(new Date(list.displayCreDate))
								: formatDate(new Date(list.displayUpDate))}</span>
						</div>
						<div>
							<span>${list.pageName}(${list.workName})</span>
							<span>${list.content}</span>
							<span>${list.nickName}(${list.blockCreUser})</span>
							</div>
					</div>
				`;
			}else{					//데이터베이스일 때
				dataDiv = `
				<div class="resultItem" data-pageid="${list.pageId}" data-parentid="${list.parentId}">
				<div>
					<span>타입</span>
					<span>${list.caseName}</span>
				</div>
				<div>
				<span>${list.parentName}(${list.workName})</span>
				<span>${list.pageName}</span>
				</div>
				</div>
				`;
			}
			ResultDiv.innerHTML += dataDiv;
		}
		document.querySelectorAll(".resultItem").forEach(resultDIV=>{
			resultDIV.addEventListener('click', getPageBlock);
		});
	}).catch(err=>console.log(err));
}


function getPageBlock(e){
console.log(e.currentTarget);
	let blockId = e.currentTarget.dataset.blockid;
	
	selectPage(e.currentTarget.dataset.pageid);
	if(e.currentTarget.dataset.blockid != null){
		setTimeout(() => cusorMove(blockId), 500);
	}
	WKDBMod.className = "hide"
}