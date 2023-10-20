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
//알림 탭 별 목록 재설정 :: OK
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
		let alarms = insertDiv.querySelectorAll('.alarms');
		alarms.forEach(work => work.remove());	//목록 초기화
		
		//목록 세팅
		data.result.forEach(item=>{
			console.log(item)
			let text = textReturn(item);
			insertDiv.insertAdjacentHTML("beforeend",text);
			clickAlarmEvent()
		})

		//이벤트 세팅
		if(type == 'all' || type =='REPLY_TG'){
			document.querySelectorAll('#alarmList input[type="checkbox"]').forEach(items => {
				allBox.addEventListener('change',function(e){
					items.checked = allBox.checked;
				})
			})	//체크박스 이벤트
			
			document.querySelectorAll('.alarms').forEach(items => {
				items.addEventListener('click', function(e){
					if(e.target.tagName == "INPUT") return;
					selectPage(e.currentTarget.dataset.id);
					alarmMod.className = 'hide';
				});
			})	//페이지 이동 이벤트
		}else if(type =='invite'){
			
		}
	})
	.catch(error => {
	    console.error('오류 발생:', error);
	})
}

//타입별 목록 형태
function textReturn(item){
	if(item.noteType == 'LOCK_FR'){
		return `<div class="alarms" data-note="${item.noteId}" data-id="${item.pageId}">
					<div class="alarm_header">
						<div>
							<img src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:30px; height:30px; border-radius:15px;">
						</div>
						<div><span>${item.creDate}</span></div>
						<div>
							<input type="checkbox" data-id="${item.noteId}">
						</div>
					</div>
					<div class="alarm_content">
						<span class="tagMe">${item.creUserName}(${item.creUserId})님이 페이지 잠금을 요청했습니다.</span>
					</div>
				</div>`
	}else if (item.noteType == 'LOCK_TR'){
		return `<div class="alarms" data-note="${item.noteId}" data-id="${item.pageId}">
					<div class="alarm_header">
						<div>
							<img src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:30px; height:30px; border-radius:15px;">
						</div>
						<div><span>${item.creDate}</span></div>
						<div>
							<input type="checkbox" data-id="${item.noteId}">
						</div>
					</div>
					<div class="alarm_content">
						<span class="tagMe">${item.creUserName}(${item.creUserId})님이 페이지 잠금해제를 요청했습니다.</span>
					</div>
				</div>`
	}else if(item.noteType == 'REPLY_TG'){
		return `<div class="alarms" data-note="${item.noteId}" data-id="${item.pageId}" data-block="${item.displayId}" data-reply="${item.replyId}">
					<div class="alarm_header">
						<div>
							<img src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:30px; height:30px; border-radius:15px;">
						</div>
						<div>
							<span>${item.creDate}</span>
						</div>
						<div>
							<input type="checkbox" data-id="${item.noteId}">
						</div>
					</div>
					<div class="alarm_content">
						<span class="whoTagMe">${item.creUserName}(${item.creUserId})님이 내 글에 댓글을 달았습니다</span>
					</div>
				</div>`
	}else{
		return `<div class="alarms" data-note="${item.noteId}">
					<div class="alarm_header">
						<div>
							<img src="${item.platform == 'KAKAO' ? item.profile : '/files/'+ item.profile}"
							onerror="this.src='images/noneUser.jpg'" style="width:30px; height:30px; border-radius:15px;">
						</div>
						<div>
							<span class="inviteDate">${item.creDate}</span>
						</div>
						<div>
							<input type="button" class="joinOkBtn btn" value="수락" data-nid = "${item.noteId}" data-email = "${item.creUserId}" data-wid ="${item.workId}">
							<input type="button" class="joinNoBtn btn" value="거절" data-nid = "${item.noteId}" data-email = "${item.creUserId}" data-wid ="${item.workId}">
						</div>
					</div>
					<div class="alarm_content">
						<span class="inviteText">${item.creUserName}(${item.creUserId})님이 ${item.workName}에 초대했습니다</span>
					</div>
				</div>`
	}
}



//목록 개별 클릭 시 이벤트 함수 (초대수락거절/해당 위치로 이동)
function clickAlarmEvent(){
	document.querySelectorAll(".joinOkBtn, .joinNoBtn").forEach(result => {
		result.addEventListener('click',function(){
			let clickType;
			clickType = "OK";
			if(result.className == 'joinNoBtn btn'){
				clickType = "NO";
			}
			let email = document.querySelector("#side input.logUser").value;
			console.log(email);
			let inviteAttribute = {
				reUserId : email,
				workId : result.dataset.wid,
				noteId : result.dataset.nid,
				alarmType : clickType
			};
			let url = "/clickInvite";
			fetch (url,{
				method : 'POST',
				body:JSON.stringify(inviteAttribute),
				headers: {'Content-Type': 'application/json'}
			})
			.then(res =>res.text())
			.then(result => {
				console.log(result);
				allList();
				showAlarmList('all');
			})
			.catch(reject => {
				console.log(reject);
			})	
		}) 
	})	
}


//읽음 체크
(document.querySelector("#alarmFunc").children)[0].addEventListener('click', function(e){
	let checkList = [];
	document.querySelectorAll("#alarmList input[type='checkbox']:checked").forEach(item => {
        let readList = {};
		readList.noteId =  item.dataset.note;
        checkList.push(readList);
    })
    let url = '/alarmRead'
    fetch (url,{
        method: 'POST',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(checkList)
    })
    .then(res=>res.json())
    .then(result => { 
		console.log(result.result);
		//아작스로 체크된 알림을 읽음 처리 화면단에서 어케 보여줌?
        
		console.log(result)
    })
    .catch(reject=>console.log(reject));
});

//알림 삭제 이벤트
(document.querySelector("#alarmFunc").children)[1].addEventListener('click', function(e){
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
});
