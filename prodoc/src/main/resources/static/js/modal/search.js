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


//검색 결과 테이블 세팅
function settingSearchResult(headers, data){
	let pageId = "";
	//헤더 재설정--------------------------------------------------------------
	let WKDBHeader = document.querySelector('.SearchResult thead');
	WKDBHeader.innerHTML = "";
	let headerTr = document.createElement('tr');
	for(let head of headers){
		for(let pair in head){
			if(pair != "pageId"){
				let td = document.createElement('td');
				td.innerText = head[pair];
				headerTr.appendChild(td);
			}
		}
	}
	WKDBHeader.appendChild(headerTr);
	
	//바디 재설정--------------------------------------------------------------
	let WKDBbody = document.querySelector('.SearchResult tbody');
	WKDBbody.innerHTML = "";
	if(data.length == 0){ return;}	//검색 결과가 없으면 종료
	
	for(let list of data){								//결과 리스트 한 행 중
		//console.log(list);
		let tr = document.createElement('tr');
		for(let head of headers){ 	
			for(let pair in head){					//헤더와 아이디가 같은 데이터만
				if(pair == "pageId"){
				 	tr.setAttribute('data-pageid', list.pageId);
					tr.setAttribute('data-blockid', list.displayId);
				}else if(pair == "blockCreUser"){
					let td = document.createElement('td');	//컬럼 만들기				
					td.innerText = list.nickName +"("+ list[pair] + ")";
					tr.appendChild(td);
				}else if(pair == "displayDate"){
					let td = document.createElement('td');	//컬럼 만들기
					if(list.displayUpDate == null){
						let date = new Date(list.displayCreDate);
						let year = date.getFullYear().toString();
						let month = (date.getMonth()+1) >= 10?
									(date.getMonth()+1) : "0"+ (date.getMonth()+1);
						let day = date.getDate() >= 10?
									date.getDate() : "0" + date.getDate();
						
						td.innerText = `${year}-${month}-${day}`;
					}else{
						let date = new Date(list.displayUpDate);
						td.innerText = date.toISOString().substr(0, 10);
					}
					tr.appendChild(td);
				}else if(list[pair] != null){
					let td = document.createElement('td');	//컬럼 만들기
					td.innerText = list[pair];
					tr.appendChild(td);
				}
			}
		}
		tr.addEventListener('click', getPageBlock);
		WKDBbody.appendChild(tr);
	}
}

function getPageBlock(e){	//TODO: 클릭 시 로우 이동 후 모달 닫기
console.log(e.currentTarget);
	let blockId = e.currentTarget.dataset.blockid;
	
	selectPage(e.currentTarget.dataset.pageid);
	if(e.currentTarget.dataset.blockid != null){
		setTimeout(() => cusorMove(blockId), 500);
	}
	WKDBMod.className = "hide"
}
