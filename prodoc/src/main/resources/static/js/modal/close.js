//닫기버튼
let closeBtn = document.querySelectorAll('.closeBtn')
	.forEach(tag => {
		tag.addEventListener('click', function (e) {
			let modal = e.target.parentElement.parentElement.parentElement;
			if (modal.className == 'hide') {
				modal.className = 'view'
			}else {
				modal.className = 'hide'
			}
		});
	});