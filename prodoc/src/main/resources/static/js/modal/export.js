import { jsPDF } from "jspdf";

document.querySelector('#exportPg').addEventListener('click', function (e) {
    let exportpg = document.querySelector('#exportModal');
    exportpg.classList.remove('hide');
    console.log(pageBlockId);
})

function exportModal() {
    document.querySelector('#exportModal').classList.add('hide');
}

document.querySelector('#fromExport').addEventListener('click', function (e) {
    var doc = new jsPDF("p", "mm", "a4");
    doc.line(15, 19, 195, 19); // 선그리기(시작x, 시작y, 종료x, 종료y)
    doc.text(15, 40, '안녕하세요'); // 글씨입력(시작x, 시작y, 내용)
    doc.save('web.pdf'); //결과 출력
});

// malgun => 맑은고딕???폰트
//console.log(malgun);