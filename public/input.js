const inputHeader = document.querySelector("section.container header.input-header");
const inputBtn = document.querySelector("section.container header.input-header .input-tab-btn");
const inputTab = document.querySelector("section.container header.input-header .input-tab");
const listBtn = document.querySelector("#list-button");
const imageBtn = document.querySelector("#image-button");
const listContainer =  document.querySelector("section.container header.input-header .input-tab ul.input-list");
const descriptionContainer = document.querySelector("section.container header.input-header .input-tab > p.description");

inputBtn.style.display = "inherit";
inputTab.style.display = "none";

document.addEventListener('click', (event) => {
    if( inputHeader.contains(event.target) ) {
            if( inputTab.style.display == "none") {
                inputTab.style.display = "inherit";
                inputBtn.style.display = "none";

                if(event.target == listBtn) {
                addList();
                }

                else if(event.target == imageBtn) {
                        addImage();
                }
                else {
                        addDescription();
                }
            }

    } 
    else {
            inputBtn.style.display = "inherit";
            inputTab.style.display = "none";
    }
    
})

function clearDisplay() {
        listContainer.style.display = "none";
        descriptionContainer.style.display = "none";
}

function addList() {
        clearDisplay();
        listContainer.style.display = "initial";
}

function addImage() {
        clearDisplay();
        console.log("image added");
}

function addDescription() {
        clearDisplay();
        descriptionContainer.style.display = "initial";
}