import { getData } from './index.js';
import { router } from './router.js';

const notePopupVisible = document.querySelector("#note-checkbox");
const popupHeader = document.querySelector("#note > .popup > .popup-header");
const popupBody = document.querySelector("#note > .popup > .popup-body");
const popupFooter = document.querySelector("#note > .popup > .popup-footer");

export function openNote(note) {
    getData(`notes/${note}`)
    .then(res => res.json())
    .then( res => openNotePopup(res.note));
}

function openNotePopup(note) {
    notePopupVisible.checked = true;

    popupHeader.lastElementChild.innerHTML = note.title;
    if( note.isPinned ) {
        popupHeader.firstElementChild.classList.add("active");
        popupHeader.firstElementChild.setAttribute("data-value", "unpin");
    }
    else {
        popupHeader.firstElementChild.classList.remove("active");
        popupHeader.firstElementChild.setAttribute("data-value", "pin");
    }

    popupBody.firstElementChild.innerHTML = note.description;

    let inputListElem = null;
    for(let elem of popupBody.children)
        if(elem.classList.contains("input-list")) {
            inputListElem = elem;
            break;    
        }
    if(note.list && note.list.length > 0) {
        note.list.forEach( list => {
            const li = addListItem();
            li.innerHTML = list;
            inputListElem.appendChild(li);
        });
        inputListElem.style.display = "initial";
    }
    else {
        inputListElem.style.display = "none";
    }

    let imagesElem = null;
    for(let elem of popupBody.children)
        if(elem.classList.contains("images-section")) {
            imagesElem = elem;
            break;    
        }
    if(note.images && note.images.length > 0) {
        note.images.forEach( imageUrl => {
            const li = document.createElement("li");
            const image = document.createElement("img");
            image.setAttribute('src', imageUrl);
            image.classList.add("uploaded-image")
            li.appendChild(image);
            imagesElem.firstElementChild.appendChild(li);
        });
        imagesElem.style.display = "initial";
    }
    else {
        imagesElem.style.display = "none";
    }

    
    console.log(note);
    console.log(popupHeader);
    console.log(popupBody);
    console.log(popupFooter);
}

function addListItem() {
    const li = document.createElement("li");
    li.classList.add("list-item");
    const i = document.createElement("i");
    i.classList.add("fa");
    i.classList.add("fa-plus");
    const p = document.createElement("p");
    p.setAttribute("contenteditable", true);
    li.appendChild(i);
    li.appendChild(p);
    return li;
}


export function closeEditNotePopup() {
    notePopupVisible.checked = false;
    router.navigateTo(router.prevLocation);
}