document.querySelector('#exportPg').addEventListener('click', function (e) {
    let exportpg = document.querySelector('#exportModal');
    exportpg.classList.remove('hide');
})




function closeModal() {
    document.querySelector('#exportPg').classList.add('hide');
}