let alarmMod = document.querySelector('#alarmModal');
let armMenu = document.querySelectorAll('#alarmMenu li');
let armList = document.querySelector('#alarmList');

//알림 모달 열기
document.querySelector('#alarm').addEventListener('click', function(e){
	if(alarmMod.className == 'hide')
		alarmMod.className = 'view';
	else	alarmMod.className = 'hide';
});

//알림 탭 별 목록 재설정
armMenu.forEach((tag, idx, list) => {
	tag.addEventListener('click', function(e){
		if(idx == 0){//allAlarm
			console.log("전체알림")
			showAlarmList('all');
		}else if(idx == 1){//replyAlarm
			console.log("댓글 알림")
			showAlarmList('REPLY_TG')
		}else{//inviteAlarm
			console.log("초대 알림")
			showAlarmList('invite')
		}
	});
});

//목록 가져오는 함수
function showAlarmList(type){
	let obj = {};
	obj.noteType = type;
	let insertDiv = document.querySelector('#alarmList');
	fetch('/alarmList',{
		method: 'POST',
		body:JSON.stringify(obj),
		headers: {'Content-Type': 'application/json'}
	})
	.then(response => response.json())
	.then(data => {
		let alarms = insertDiv.querySelectorAll('.alarms');
		alarms.forEach(work => {
			work.remove();
		})
	    data.result.forEach(item=>{
			console.log(item)
	    	let text = `<div class="alarms"><img src = "images/${item.profile}">
			<span class="whoTagMe">${item.creUserName}님이 내 글에 댓글을 달았습니다</span>
			<span>${item.replyId}</span><span>${item.pageId}</div>`
	    	insertDiv.insertAdjacentHTML("beforeend",text);
	    })
		document.querySelectorAll('.alarms').forEach(items => {
			items.addEventListener('click', function(e){
				let pId = items.lastElementChild.innerHTML;
				console.log("aa")
				makeBlockPage(pId)
			});
		})
	})
	.catch(error => {
    console.error('오류 발생:', error);

})
	
}


//목록 세팅


//목록 개별 클릭 시 이벤트 함수 (초대수락거절/해당 위치로 이동)



//알림 삭제 이벤트