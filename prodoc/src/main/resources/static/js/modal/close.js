//닫기버튼
let closeBtn = document.querySelectorAll('.closeBtn')
.forEach(tag => {
	tag.addEventListener('click',function(e){
		let modal = e.target.parentElement.parentElement;
		console.log(modal);
		if(modal.className == 'view'){
			modal.className = 'hide';
		}else{		
			modal.className = 'view';
		}
	});
});