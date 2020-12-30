const inputHeader = document.querySelector("section.container header.input-header");
const inputBtn = document.querySelector("section.container header.input-header .input-tab-btn");
const inputTab = document.querySelector("section.container header.input-header .input-tab");


document.addEventListener('click', (event) => {
    if( inputHeader.contains(event.target) ) {
            inputTab.style.display = "block";
            inputBtn.style.display = "none";
    } 
    else {
            inputBtn.style.display = "block";
            inputTab.style.display = "none";
    }
})