

//WORK , DB 토글
let workMd = document.querySelector("#showWorkBtn");	//work 찾기
let dbMd = document.querySelector("#showDBBtn") 		//db 찾기
document.querySelectorAll(".findBtn").forEach((tag,idx) => {	
	tag.addEventListener('click', function(e){
		if(idx == 0){	//아이디 찾기
			workMd.className = "view";
			dbMd.className = "hide";
		}else{			//비밀번호 찾기
			workMd.className = "hide";
			dbMd.className = "view";
		}
	});
});