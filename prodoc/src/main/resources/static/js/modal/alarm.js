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
armMenu.forEach(tag, idx, list => {
	tag.addEventListener('click', function(e){
		if(idx == 0){//allAlarm
		
		}else if(idx == 1){//mentionAlarm
		
		}else if(idx == 2){//replyAlarm
		
		}else{//inviteAlarm
		
		}
	});
});

//목록 가져오는 함수
function allArm(){
	
}


//목록 세팅


//목록 개별 클릭 시 이벤트 함수 (초대수락거절/해당 위치로 이동)



//알림 삭제 이벤트