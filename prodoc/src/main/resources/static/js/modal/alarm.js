let alarmMod = document.querySelector('#alarmModal');
let armMenu = document.querySelectorAll('#alarmMenu li');
let armList = document.querySelector('#alarmList');
let clickedTab;
//알림 모달 열기
document.querySelector('#alarm').addEventListener('click', function(e){
	if(alarmMod.className == 'hide'){
		alarmMod.className = 'view';
		alarmMod.style.backgroundColor = "";
		showAlarmList('all');
	}
	else{
		alarmMod.className = 'hide';
	}
});
//알림 탭 별 목록 재설정
armMenu.forEach((tag, idx, list) => {
	tag.addEventListener('click', function(e){
		if(idx == 0){//allAlarm
			console.log("전체알림")
			clickedTab = 'all';
			showAlarmList(clickedTab);
		}else if(idx == 1){//replyAlarm
			console.log("댓글 알림")
			clickedTab = 'REPLY_TG';
			showAlarmList(clickedTab)
		}else{//inviteAlarm
			console.log("초대 알림")
			clickedTab = 'invite';
			showAlarmList(clickedTab)
		}
	});
});

//목록 가져오는 함수
function showAlarmList(type){
	let obj = {};
	obj.noteType = type;
	let insertDiv = document.querySelector('#alarmList');
	let allBox = document.querySelector('#allCheckBox')
	fetch('/alarmList',{
		method: 'POST',
		body:JSON.stringify(obj),
		headers: {'Content-Type': 'application/json'}
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		if(type=='all'){
			let alarms = insertDiv.querySelectorAll('.alarms');
			alarms.forEach(work => {
				work.remove();
			})
			data.result.forEach(item=>{
				console.log(item)
				let text = "";
				if(item.noteType == 'LOCK_FR'){
					text = `<div class="alarms" data-id="${item.pageId}">
							<img th:src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:15px; height:15px; border-radius:7.5px;">
							<span class="tagMe">${item.creUserId}님이 페이지 잠금을 요청했습니다.</span>
							<input type="checkbox" data-id="${item.noteId}">
							</div>`
				}else if(item.noteType == 'LOCK_TR'){
					text = `<div class="alarms" data-id="${item.pageId}">
							<img th:src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:15px; height:15px; border-radius:7.5px;">
							<span class="tagMe">${item.creUserId}님이 페이지 잠금해제를 요청했습니다.</span>
							<input type="checkbox" data-id="${item.noteId}">
							</div>`
				}else if(item.noteType == 'REPLY_TG'){
					text = `<div class="alarms" data-id="${item.pageId}">
							<img th:src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:15px; height:15px; border-radius:7.5px;">
							<span class="whoTagMe">${item.creUserId}님이 내 글에 댓글을 달았습니다</span>
							<span>${item.replyId}</span>
							<input type="checkbox" data-id="${item.noteId}">
							</div>`
				}else{
					text = `<div class="alarms" >
							<img th:src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:15px; height:15px; border-radius:7.5px;">
							<span class="inviteText">${item.creUserName}님이 ${item.workName}에 초대했습니다</span>
							<span class="inviteDate">${item.creDate}</span>
							<input type="button" class="joinOkBtn" value="수락"> <input type="button" class="joinNoBtn" value="거절">
							</div>`
				}
				
				insertDiv.insertAdjacentHTML("beforeend",text);
			})
			document.querySelectorAll('#alarmList input[type="checkbox"]').forEach(items => {
				allBox.addEventListener('change',function(e){
					items.checked = allBox.checked;
				})
			})
			
			document.querySelectorAll('.alarms').forEach(items => {
				items.addEventListener('click', function(e){
					// selectPage(e.currentTarget.dataset.pageid);
					
				});
			})
		}else if(type =='REPLY_TG'){
			let alarms = insertDiv.querySelectorAll('.alarms');
			alarms.forEach(work => {
				work.remove();
			})
			data.result.forEach(item=>{
				console.log(item)
				let text = `<div class="alarms" data-id="${item.pageId}">
							<img th:src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:15px; height:15px; border-radius:7.5px;">
							<span class="whoTagMe">${item.creUserId}님이 내 글에 댓글을 달았습니다</span>
							<span>${item.replyId}</span>
							<input type="checkbox" class="replyCheckBox" data-id="${item.noteId}"> 
							</div>`
				insertDiv.insertAdjacentHTML("beforeend",text);
			})
			document.querySelectorAll('#alarmList input[type="checkbox"]').forEach(items => {
				allBox.addEventListener('change',function(e){
					items.checked = allBox.checked;
				})
			})
			
			document.querySelectorAll('.alarms').forEach(items => {
				items.addEventListener('click', function(e){
					// selectPage(e.currentTarget.dataset.pageid);
					
				});
			})
		}else if(type =='invite'){
			let alarms = insertDiv.querySelectorAll('.alarms');
			alarms.forEach(work => {
				work.remove();
			})
			data.result.forEach(item=>{
				let text = `<div class="alarms">
							<img th:src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:15px; height:15px; border-radius:7.5px;">
							<span class="inviteText">${item.creUserName}님이 ${item.workName}에 초대했습니다</span>
							<span class="inviteDate">${item.creDate}</span>
							<input type="button" class="joinOkBtn" value="수락"> <input type="button" class="joinNoBtn" value="거절">
							</div>`
				insertDiv.insertAdjacentHTML("beforeend",text);
			})
			document.querySelectorAll('.alarms').forEach(items => {
				items.addEventListener('click', function(e){
					// selectPage(e.currentTarget.dataset.pageid);
					
				});
			})
		}
	})
	.catch(error => {
    console.error('오류 발생:', error);

})
	
}


//목록 세팅


//목록 개별 클릭 시 이벤트 함수 (초대수락거절/해당 위치로 이동)



//읽음 체크
(document.querySelector("#alarmFunc").children)[0].addEventListener('click', function(e){
	console.log(this);
	let checkList = [];	//체크된 아이들 담는 용도

	//아작스로 체크된 알림을 읽음 처리
});

//알림 삭제 이벤트
	(document.querySelector("#alarmFunc").children)[3].addEventListener('click', function(e){
		console.log(this);
		let checkList = [];	//체크된 아이들 담는 용도
		document.querySelectorAll("#alarmList input[type='checkbox']:checked").forEach(item => {
			let obj = {};
			obj.noteId = item.dataset.id;
			checkList.push(obj);
		})
		//아작스ㄴㄴ 패치oo로 체크된 알림을 삭제
		let url = '/alarmDelete'
		fetch (url, {
			method : 'POST',
			headers : {'Content-Type': 'application/json'},
			body : JSON.stringify(checkList)
		})
		.then(res => res.json())
		.then(result => {
			console.log(result.result);	//result.result == true or false
			showAlarmList(clickedTab)
		})
		.catch(err=>console.log(err));
		//.then(data => {
		//	console.log(data);
		//})
	});
	