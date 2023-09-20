//정보수정 버튼 클릭
let modInfoBtn = document.querySelector("#modInfoBtn")
.addEventListener('click', function(e){
	//console.log(e.target.parentElement);
	e.target.parentElement.classList.toggle('hide');
	e.target.parentElement.classList.toggle('view');
	let UserModiMod = document.querySelector("#UserModiMod");
	UserModiMod.classList.toggle('view');
	UserModiMod.classList.toggle('hide');
});

//탈퇴 버튼 클릭 ->탈퇴창 보여줌
let joinOutBtn = document.querySelector("#joinOutBtn")
.addEventListener('click', function(e){
	//console.log(e.target.closest('form').parentElement);
	e.target.closest('form').parentElement.classList.toggle('hide');
	e.target.closest('form').parentElement.classList.toggle('view');
	let joinOutMod = document.querySelector("#joinOutMod");
	joinOutMod.classList.toggle('view');
	joinOutMod.classList.toggle('hide');
});
//탈퇴 진행
let jOutBtn = document.querySelector("#jOutBtn")
.addEventListener('click', function(e){
	if(joinout.value != ''){
		console.log(e.target.parentElement);
		e.target.parentElement.classList.toggle('hide');
		e.target.parentElement.classList.toggle('view');
		let joinout = document.querySelector("#joinout");
		
		fetch("/joinout", {
			method: "post",
			body: JSON.stringify({"password" : joinout.value}),
			headers: {'content-Type' : 'application/json'}
		}).then(response => response.json())
		.then( result => {
			if(result.result == true)
				document.location.href = "/";	//탈퇴 성공 -> 로그인으로 이동
			else
				alert(result.msg);	//실패 메시지
			
		}).catch(err => console.log(err));
	}
});

//수정 저장 버튼
let infoSaveBtn = document.querySelector("#infoSaveBtn")
.addEventListener('click', function(e){
	console.log('저장');
});

//인증번호 전송
let authBtn = document.querySelector("#authBtn")
.addEventListener('click', function(e){
	console.log('전송');
});

//인증번호 확인
let authCheckBtn = document.querySelector("#authCheckBtn")
.addEventListener('click', function(e){
	console.log('확인');
});