let trashModal = document.querySelector("#modTrash");
document.querySelector("#trashBasket")
.addEventListener('click', function(e){
	if(trashModal.className == "hide"){
		trashModal.className = "view"
		SearchTrash();
	}else 
		trashModal.className = "hide"
});

//startDate 최소 날짜 세팅
let tStartDate = document.querySelector("#modTrash input[name='startDate']");
function TrashMinDate(){
	let fifteen = new Date(new Date() - 1296000000);	//오늘로부터 15일 전
	let year = fifteen.getFullYear();
	let month = (fifteen.getMonth() + 1) >= 10 ? 
				(fifteen.getMonth() + 1) : "0" + (fifteen.getMonth() + 1);
	let date = fifteen.getDate() >= 10 ? fifteen.getDate() : "0"+fifteen.getDate();
	let minDate = `${year}-${month}-${date}`;

	tStartDate.min = minDate;
}

//endDate 최소 날짜 세팅
tStartDate.addEventListener('change', function(e){
	let eDate = this.nextElementSibling;
	eDate.disabled = false;
	eDate.min = this.value;
	if(eDate.value > this.value)
		eDate.value = "";
});

//검색 날짜 초기화
document.querySelector('#trashResetBtn')
.addEventListener('click', function(e){
	tStartDate.value = "";
	tStartDate.nextElementSibling.value = "";
	tStartDate.nextElementSibling.disabled = true;
});

//검색 버튼 클릭
document.querySelector('#trashSearchBtn').addEventListener('click', SearchTrash);

//검색 프로세스
function SearchTrash(){
	let dataList = {};
	dataList.keyword = document.querySelector("#trashKey").value;
	dataList.select = document.querySelector("#modTrash input[type='radio']:checked").value;
	dataList.sDate = tStartDate.value;
	dataList.eDate = tStartDate.nextElementSibling.value = "";
	console.log(dataList);
	
	fetch("/trash",{
		method: "post",
		body: JSON.stringify(dataList),
		headers: {'content-Type' : 'application/json'}
	}).then(response => response.json())
	.then(result => {
		console.log(result);
	}).catch(err => console.log(err));
}

//결과 세팅

//로우로 복구...