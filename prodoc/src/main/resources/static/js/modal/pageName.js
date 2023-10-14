//페이지 이름 변경 모달 열기 :: 은주
function PageNameSettingFunc(){
	document.querySelectorAll(".editPN").forEach(tag => {
		let pid = tag.parentElement.dataset.id
		//let pname = tag.parentElement.children[1].innerText;
		
		tag.addEventListener('click', function(e){
			PNmod.className ="view";
			PNmod.dataset.id= pid;

			let newPName = document.querySelector("#editPageMod input");
			newPName.value = "";
		});
	});
}

//페이지 이름 변경 모달 내 클릭 이벤트 :: 은주
let PNmod = document.querySelector("#editPageMod");
document.querySelector("#newPageNameBtn").addEventListener('click', function(e){
	let value = this.previousElementSibling.value;	//바뀐 페이지명
	let id = this.closest("div").dataset.id;		//해당 페이지id
	let URL = `/pageNewName?pageId=${id}&pageName=${value}`;
	
	fetch(URL, {
		method: "GET",
	    headers: {
	      "Content-Type": "application/json",
	    }
	}).then(response => response.json())
	.then(res => {
		if(res.result){	//성공
			//사이드바 페이지 이름 재설정
			document.querySelectorAll("#side .Page").forEach(pageitem => {
				if(pageitem.dataset.id == id){
					pageitem.children[1].innerText = `${value}`;
					pageitem.dataset.name = value;
				}
			});
			
			//본문 내 페이지 타이틀 재설정
			let pageTitleIs = document.querySelector(".app .pageHead input#TitleWid");
			if(pageTitleIs.dataset.pageid == id){
				let pageTitle = pageTitleIs.previousElementSibling;
				pageTitle.innerText = value;
				console.log(pageTitle);
			}
			
			//본문 내 데이터베이스 타이틀 재설정
			document.querySelectorAll(".app .database_case .db-block-header").forEach(dbTitleIs=>{
				let databaseIs = dbTitleIs.closest(".database_case");
				console.log(dbTitleIs);
				console.log(databaseIs.dataset.pageId);
				console.log(id);
				if(databaseIs != null && databaseIs.dataset.pageId == id){
					console.log(dbTitleIs.children[0]);
					dbTitleIs.children[0].innerText = value;
				}			
			});
			
		}else{
			alert('알 수 없는 이유로 페이지 이름 변경에 실패하였습니다.');
		}
		PNmod.className ="hide";
	}).catch(err => console.log(err));
});