document.querySelector('#exportPg').addEventListener('click', function (e) {
    let exportpg = document.querySelector('#exportModal');
    exportpg.classList.remove('hide');
    document.querySelector('#menu').classList.add('hide');
})




function closeModal() {
    document.querySelector('#exportPg').classList.add('hide');
}