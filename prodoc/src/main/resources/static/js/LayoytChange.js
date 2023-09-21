/*
        let changeLayout = e.currentTarget.getAttribute("id");
        if(changeLayout == 'dbGal') changeGal();
        else if(changeLayout == 'dbTbl') changeTbl();
        else if(changeLayout == 'dbCal') changeCal();
        else if(changeLayout == 'dbBrd') changeBrd();
        else if(changeLayout == 'dbList') changeList();

*/

// 레이아웃 : LIST
function changeList(e){
    let dbPageBody = document.getElementById("db-page-body");
    dbPageBody.innerHTML = "";

    getDBPageList();
    //pageList
    pageList.forEach(info => {
        console.log(info);
    });

}

// 레이아웃 : TBL
function changeTbl(e){
    console.log(e)
}