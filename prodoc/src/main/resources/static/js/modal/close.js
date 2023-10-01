//닫기버튼
let closeBtn = document.querySelectorAll('.closeBtn')
	.forEach(tag => {
		tag.addEventListener('click', function (e) {
			let modal = e.target.parentElement.parentElement;
			if (modal.className == 'hide') {
				modal.classList.remove('hide');
			} else {
				modal.classList.add('hide');
			}
		});
	});