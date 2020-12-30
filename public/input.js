const inputHeader = document.querySelector("section.container header.input-header");
const inputBtn = document.querySelector("section.container header.input-header .input-tab-btn");
const inputTab = document.querySelector("section.container header.input-header .input-tab");
const listBtn = document.querySelector("#list-button");
const imageBtn = document.querySelector("#image-button");

document.addEventListener('click', (event) => {
    if( inputHeader.contains(event.target) ) {
            inputTab.style.display = "block";
            inputBtn.style.display = "none";

            if(event.target == listBtn) {
               addList();
            }

            else if(event.target == imageBtn) {
                addImage();
             }

             else {
                
             }

    } 
    else {
            inputBtn.style.display = "block";
            inputTab.style.display = "none";
    }
    
})

function addList() {
        console.log("list added");
}

function addImage() {
        console.log("image added");
}