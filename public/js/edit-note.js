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

    let labelInfoElem = null;
    for(let elem of popupBody.children)
        if(elem.classList.contains("label-info-container")) {
            labelInfoElem = elem;
            break;    
        }

    if( note.labels && note.labels.length > 0) {
        note.labels.forEach( label => {
            labelInfoElem.appendChild( getLabelElement(label) );
        });
        // labelInfoElem.style.display = "initial";
    }
    else {
        labelInfoElem.style.display = "none";
    }

    if(note.reminder && note.reminder.date)
        popupBody.insertBefore( getReminderElement( note.reminder ), labelInfoElem );
    // console.log(note);
    console.log(popupBody);
    // console.log(popupFooter);
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

function getReminderElement(reminderInfo) {
    let reminderInfoElem = document.createElement('span');
    reminderInfoElem.classList.add('reminder-info')
    reminderInfoElem.setAttribute("data-val", reminderInfo._id);
    reminderInfoElem.innerHTML = `<i class="fa fa-retweet" aria-hidden="true"></i>${reminderInfo.date + ", " + reminderInfo.time + ", " + capitalize(reminderInfo.frequency) }<i class = "fa fa-times clearReminder"></i>`
    return reminderInfoElem;
}

function getLabelElement( label ) {
    let labelInfoElem = document.createElement('div');
    labelInfoElem.classList.add('label-info')
    labelInfoElem.innerHTML = `<span> ${label.labelText} </span><i class = "fa fa-times clearLabel"></i>`
    return labelInfoElem;
}

export function closeEditNotePopup() {
    notePopupVisible.checked = false;

    popupHeader.firstElementChild.classList.remove("active");
    popupHeader.firstElementChild.setAttribute("data-value", "pin");
    popupHeader.lastElementChild.innerHTML = "";

    for(let child of popupBody.children ) {
        if( child.classList.contains("images-section") ) {
            child.firstElementChild.innerHTML = "";
        }
        else {
            child.innerHTML = "";
        }
    } 

    let reminderInfo = document.querySelector(".popup-body .reminder-info");
    if(reminderInfo)
        popupBody.removeChild(reminderInfo)

    router.navigateTo(router.prevLocation);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
