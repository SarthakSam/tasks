// import { getData } from './index.js';

const labelPopupButton = document.querySelector(".navbar .nav-list .fa-tags");

labelPopupButton.onclick = () => {
    renderLabelsPopup();
}

// common functionality
window.onload = () => {
    localStorage.setItem('location', document.location.hash.substring(1) );
    if(window.location.hash == '#labels')
        renderLabelsPopup();
}

document.addEventListener('click', (event) => {
    if(event.target.classList.contains("popup-container")) {
        closePopup();
    }
})

function renderLabelsPopup() {
    const popupBody = document.querySelector("#labels > .popup > .popup-body");
    const popupFooter = document.querySelector("#labels > .popup > .popup-footer");
    popupBody.innerHTML = "<p class='title'> Edit Labels </p>";
    popupBody.appendChild( newLabelElement() );
    popupBody.appendChild( existingLabels() );
    let button = document.createElement("button");
    button.classList.add('close-popup-btn');
    button.innerHTML = 'Done';
    button.onclick = closePopup;
    popupFooter.innerHTML = "";
    popupFooter.appendChild(button);
    
}

function closePopup() {
    let location = localStorage.getItem('location');
    window.location.hash = `#${ !location || location == 'labels'? '': location}`;
}

function newLabelElement() {
    const div = document.createElement("div");
    div.classList.add("new-label-input");
    div.innerHTML = "<i class='fas fa-plus'></i><input type='text' placeholder = 'Create new label'> <i class='fas fa-check'></i>"
    return div;
}

function existingLabels() {
    let labels = JSON.parse( localStorage.getItem("labels") );
    const ul = document.createElement('ul');
    ul.classList.add("labels-list");
    const fragment = document.createDocumentFragment();
    labels.forEach( label => {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type = "checkbox" id = "editable-toggle-${label._id}" class = "editable-toggle">
            <i class="fas fa-tag labelIcon"></i>
            <i class="far fa-trash-alt delete-label-btn"></i>
            <label class="input-area" contenteditable for = "editable-toggle-${label._id}">${label.labelText}</label>
            <label for = "editable-toggle-${label._id}">
            <i class="fas fa-pencil-alt edit-label-btn"></i>
            <i class='fas fa-check save-edited-btn'></i>
            </label>
        `;
        fragment.appendChild(li);
    } );
    ul.appendChild(fragment);
    ul.onclick = (event) => {
        if( event.target.classList.contains("editable-toggle") ) {
            let activeCheckbox = document.querySelector(".active-checkbox");
            if(activeCheckbox) {
                activeCheckbox.checked = false;
                activeCheckbox.classList.remove("active-checkbox");
            }
            event.target.classList.add("active-checkbox");
            let span = null;
            for( let elem of event.target.parentElement.children) {
                if( elem.classList.contains("input-area") ) {
                    span = elem;
                    break;
                }
            }
            span?.focus();
        }
        else if( event.target.classList.contains("delete-label-btn") ) {
            console.log("existing label deleted");
        }
        else if( event.target.classList.contains("save-edited-btn") ) {
            console.log("label saved");
        }
    }

    return ul;
}