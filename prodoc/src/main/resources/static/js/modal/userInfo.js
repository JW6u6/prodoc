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

//프로필 이미지 변경 처리
let img = document.querySelector("#profile");
let profile = document.querySelector('input[name="file"]');
img.addEventListener('click', function(e){ 				//이미지 클릭
	profile.click(); 									//파일 선택(click) 이벤트 강제 발동
	profile.addEventListener('change', function(e){		//파일 선택(change): 이미지 선택시 chang 이벤트 발생
		if(this.files[0] != null) {
		   	var reader = new FileReader;				//비동기적으로 파일 객체의 내용을 읽어들임
		    reader.onload = function(data) {
		    	img.setAttribute("src", data.target.result);
			}
		    reader.readAsDataURL(this.files[0]); //파일 정보를 주소처럼 사용, img태그의 src로 이용가능
		}
	});
});

//수정 저장
userModForm.addEventListener('submit', function(e){
	e.preventDefault();
	if(!passTrue || !phoneTrue) return;		//비밀번호, 전화번호(인증) NO
	
	let list = document.querySelectorAll("form input[name]");
	const formData = new FormData();
	for(let item of list){
		if(item.name == "file" && item.value != ""){
			formData.append(item.name, item.files[0]);
		}else{
			formData.append(item.name, item.value);
		}
	}
	fetch("/userMod", {	method: "post",	body: formData })
	.then( response => response.json() )
	.then(result => {
		if(result.result){
			alert('프로필이 수정되었습니다.');
			for(let list in result.data){
				console.log(result.data[list]);
				let name = "input[name='"+ list +"']"
				let inputT = document.querySelector(name);
				updateUser(list, inputT, result.data[list]);	//화면 수정
			}
			document.querySelector("#UserModiMod button[class='closeBtn']").click();
		}else 
			alert('프로필 수정이 실패하였습니다.');
	}).catch(err => console.log(err));
});

//사용자 정보 화면 업데이트
function updateUser(list, inputT, data){
	if(list == "email" || list == "nickname"){	//이메일, 이름 재설정
		document.querySelectorAll("#UserInfoMod p").forEach(item =>{
			if(item.className == list){
				console.log(item);
				inputT.value = data;		//정보수정창
				item.innerText = data;		//정보창
			}
		});
	}else if(list == "profile"){				//프로필 이미지 재설정
		let img = document.querySelectorAll("img.profile").forEach(item =>{
			item.src= `/files/${data != null ? data : 'noneUser.jpg'}`;
		});
	}else if(list == "password"){				//비밀번호 입력칸 재설정
		document.querySelectorAll(".password").forEach(item => item.value = "");
	}else if(list == "birth"){
		let birth = new Date(data);
		let year = birth.getFullYear().toString().substr(-2);
		let month = (birth.getMonth()+1) > 10?
					(birth.getMonth()+1) : "0"+ (birth.getMonth()+1);
		let date = birth.getDate() > 10?
					birth.getDate() : "0" + birth.getDate();
		inputT.value = year + month + date;
	}else{
		if(inputT != null)
			inputT.value = data;
	}
}

let passTrue = true;	//비밀번호 일치 여부
let phoneTrue = true;	//전화번호 인증 여부

//비밀번호 일치 체크
document.querySelectorAll(".password").forEach((tag, idx, obj)=>{
	tag.addEventListener('change', function(e){
		if(obj[0].value == obj[1].value)	passTrue = true;
		else	passTrue = false;
	});
});

//전화번호	인증 체크
let beforeN = document.querySelector("input[name='phone']").value;	//원래의 전화번호
document.querySelector("input[name='phone']")
.addEventListener('change', function(e){
	//원래의 전화번호에서 변경이 일어나면 인증 여부 초기화
	if(e.target.value == beforeN)	phoneTrue = true;
	else 							phoneTrue = false;
});

//휴대폰 인증번호 전송
let authMsg = "";	//불러올 인증번호
let authBtn = document.querySelector("#authBtn")
.addEventListener('click', function(e){
	if(phoneTrue) return;	//인증이 된 번호
	//TODO: 인증번호 전송 프로세스
	console.log('전송');
});

//휴대폰 인증번호 확인
const authCheck = document.querySelector("#auth");
let authCheckBtn = document.querySelector("#authCheckBtn")
.addEventListener('click', function(e){
	if(phoneTrue) return;	//인증이 된 번호
	if(authMsg == authCheck.value){	//인증번호 일치
		phoneTrue = true;
		console.log('인증 확인');
	}
});