function helloWorld(){
    const dbBlock = document.querySelectorAll(".db_block");
    dbBlock.forEach(item=>{
        item.addEventListener("drop",(e)=>{
            const dragDBblock = document.querySelector(".dragging");
            const targetDBblcok = e.currentTarget;
            const targetHeight = targetDBblcok.offsetHeight;
            const targetWidth = targetDBblcok.offsetWidth;
            const targetCenter = targetHeight / 2;
            
            console.log(targetCenter,e.offsetY);

            if(targetCenter > e.offsetY){
                console.log("위에있다");
                targetDBblcok.parentElement.insertBefore(dragDBblock, targetDBblcok);
            } else {
                insertAfter(dragDBblock,targetDBblcok);
                console.log("아래에 있다.")
            }
            // console.log(targetHeight,targetWidth)
            
        })
        item.addEventListener("dragover",(e)=>{
            e.preventDefault()
        })
        item.addEventListener("dragstart",(e)=>{
            e.target.classList.add(".dragging")
            console.log("DRAGSTART:",e.target)
        })
        item.addEventListener("dragend",(e)=>{
            e.target.classList.remove(".dragging")
        })
    })
}


