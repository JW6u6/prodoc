//모달창 열기
let WKDBMod = document.querySelector("#modSearchWKDB");	//모달
document.querySelector("#searchWKDB")
.addEventListener('click', function(e){
	if(WKDBMod.className == "hide")
	WKDBMod.className = "view"
else WKDBMod.className = "hide"
});

//WORK , DB 검색 토글
let wkdbType = "wk";
let workMd = document.querySelector("#wkDiv");	//work 찾기
let dbMd = document.querySelector("#dbDiv") 	//db 찾기
document.querySelectorAll(".findBtn").forEach((tag,idx) => {	
	tag.addEventListener('click', function(e){
		if(idx == 0){
			wkdbType = "wk";					//wk 찾기
			workMd.className = "view";
			dbMd.className = "hide";
			document.querySelectorAll('input[name="dbOption"]')
			.forEach(item => item.checked = false )
		}else{									//db 찾기
			wkdbType = "db";
			workMd.className = "hide";
			dbMd.className = "view";
		}
	});
});

//날짜 검색 활성화
document.querySelector("button#dateBtn").addEventListener('click', function(e){
	let child = [];
	child.push(this.closest("div").children[0]);
	child.push(this.closest("div").children[1]);
	child.forEach(tag =>{ tag.disabled = !tag.disabled; });
});

//최대 날짜 세팅
function settingDates(){
	let today = new Date();
	let year = today.getFullYear();
	let month = (today.getMonth() + 1) > 10 ? 
				(today.getMonth() + 1) : "0" + (today.getMonth() + 1);
	let date = today.getDate() > 10 ? today.getDate() : "0"+today.getDate();
	return `${year}-${month}-${date}`;
}

//최소 날짜 세팅
document.querySelector("input[name='startDate']")
.addEventListener('change', function(e){
	this.nextElementSibling.min = this.value;
});

//검색 버튼 click 이벤트
document.querySelector("#searchBtn")
.addEventListener('click', function(e){
	let keyword = this.previousElementSibling.value;
	if(keyword == ''){ alert('검색어를 입력해주세요.'); return; }
	let dataList = {};
	let checkList = [] , dateList = [];
	
	dataList.keyword = keyword;
	dataList.type = wkdbType;
	if(wkdbType == 'wk'){
		console.log(wkdbType);
		document.querySelectorAll('.menuDiv input[name$="Date"]')
			.forEach(tag=> dateList.push(tag.value));
		dataList.date = dateList;
	}else{
		console.log(wkdbType);
		document.querySelectorAll('.menuDiv input[type="checkbox"]:checked')
			.forEach(tag=> checkList.push(tag.value));
		dataList.check = checkList;
	}
	console.log(dataList);
	//searchThis(dataList);
});

//검색프로세스
function searchThis(dataList){
	fetch("/findBlock", {
		method: 'post',
		body : JSON.stringify(dataList),
		headers: {'content-Type' : 'application/json'}
	}).then(response => response.json())
	.then(result =>{
		console.log(result);
		
		//setBody(data);
	}).catch(err=>console.log(err));
}

//결과 보여주기
function setBody(data){
	let body = document.querySelector('.result #resultData');
	body.contentText = "";	//바디 초기화
}