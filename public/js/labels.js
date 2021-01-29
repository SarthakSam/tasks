// import { getData } from './index.js';

const labelPopupButton = document.querySelector(".navbar .nav-list .fa-tags");

labelPopupButton.onclick = () => {
    renderLabelsPopup();
}

window.onload = () => {
    if(window.location.hash == '#labels')
        renderLabelsPopup();
}

function renderLabelsPopup() {
    const popupBody = document.querySelector("#labels > .popup > .popup-body");
    const popupFooter = document.querySelector("#labels > .popup > .popup-footer");
    // popup.innerHTML = "<p class='title'> Edit Labels </p>";
    // popup.appendChild( newLabelElement() );
    // popup.appendChild( existingLabels() );
    popupFooter.innerHTML = "<button class = 'close-popup-btn'>Done</button>";
}

function newLabelElement() {
    const div = document.createElement("div");
    div.innerHTML = "<i class='fas fa-plus'></i><input type='text'>"
    return div;
}

function existingLabels() {
    let labels = localStorage.getItem("labels");
    const fragment = document.createDocumentFragment();
    labels.forEach( label => {
        const li = document.createElement("li");
    } );
}