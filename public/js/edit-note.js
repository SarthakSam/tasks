import { getData } from './index.js';
import { router } from './router.js';
import { warningMessage, successMessage } from './message.js';
import { renderImages } from './image-upload.js'

const notePopupVisible = document.querySelector("#note-checkbox");
const popup = document.querySelector("#note > .popup");
const popupHeader = document.querySelector("#note > .popup > .popup-header");
const popupBody = document.querySelector("#note > .popup > .popup-body");
const popupFooter = document.querySelector("#note > .popup > .popup-footer");
const colorPalette = document.querySelector("#note > .popup > .popup-footer .buttons-tray ul.buttons-list li.color-btn > ul.color-palette");
const reminderForm = document.querySelector("#note > .popup > .popup-footer .buttons-tray ul.buttons-list li.reminder-btn form.reminder-form");
const reminderContainer = document.querySelector("#note > .popup > .popup-footer .buttons-tray ul.buttons-list li.reminder-btn div.reminder-form-container");
const listBtn = document.querySelector("#popup-list-button");
const listContainer =  document.querySelector("#note > .popup > .popup-body ul.input-list");
const descriptionContainer = document.querySelector("#note > .popup > .popup-body > p.description");
const uploadBtnLabel = document.querySelector("#note > .popup > .popup-body  div.images-section form label.upload-btn");
const titleContainer = document.querySelector("#note > .popup > .popup-body > p");
const buttonsTray = document.querySelector("#note > .popup > .popup-footer .buttons-tray ul");
const closeReminderBtn = document.querySelector("#note > .popup > .popup-footer .buttons-tray ul.buttons-list li.reminder-btn div.reminder-form-container p .close-reminder-btn");
const uploadBtn = document.querySelector("#note > .popup > .popup-body div.images-section form #uploaded-file");
const uploadedImagesList = document.querySelector("#note > .popup > .popup-body div.images-section ul.uploaded-images-list");


const buttonsMap = {
    reminder: addReminder,
    addUser: addUser,
    addImage: addImage,
    addList: addList,   
    showOptions: showOptions
}

export function openNote(note) {
    getData(`notes/${note}`)
    .then(res => res.json())
    .then( res => openNotePopup(res.note));
}

popupFooter.addEventListener('click', (event) => {
    if( event.target.classList.contains('close-input-tab') ) {
        closeEditNotePopup();
    }
    else if( event.target.classList.contains('saveNote-btn') ) {
        console.log("save popup");
    }
    else if( event.target.nodeName === 'LI' || event.target.nodeName === 'I') {
        const elem = event.target.nodeName === 'I'? event.target : event.target.firstElementChild;
        if( elem.getAttribute("data-value") )
        buttonsMap[ elem.getAttribute("data-value") ]();
    }
    else {

    }
});

function openNotePopup(note) {
    notePopupVisible.checked = true;

    if(note.backgroundColor) {
        popup.style.backgroundColor = note.backgroundColor
    }

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
            li.lastElementChild.innerHTML = list;
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
        labelInfoElem.style.display = "flex";
    }
    else {
        labelInfoElem.style.display = "none";
    }

    if(note.reminder && note.reminder.date)
        popupBody.insertBefore( getReminderElement( note.reminder ), labelInfoElem );
    // console.log(note);
    // console.log(popupBody);
    // console.log(popupFooter);
}

export function closeEditNotePopup() {
    notePopupVisible.checked = false;

    popup.style.backgroundColor = ""

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

    closeReminderForm();

    router.navigateTo(router.prevLocation);
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

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

closeReminderBtn.onclick = closeReminderForm;

function closeReminderForm() {
    reminderContainer.style.display = "none";
    reminderForm.elements.date.value = "";
    reminderForm.elements.time.value = "20:00";
    reminderForm.elements.frequency.value = "repeats daily";
}

reminderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let date = reminderForm.elements.date.value;
    let time = reminderForm.elements.time.value;
    let frequency = reminderForm.elements.frequency.value;
    console.log(date, time, frequency);
    if(!date || isPastDate(date))
            return;
    let dateSplitted = date.split("-");
    let reminderInfoStr = dateSplitted[2] + "/" + dateSplitted[1] + "/" + dateSplitted[0];
    createReminder(reminderInfoStr + ", " + time + ", " + capitalize(frequency) );
    reminderContainer.style.display = "none";
})

function isPastDate() {
    warningMessage("Past date is not yet made");
    // return ;
}

function createReminder(reminderInfoStr) {
   let reminderInfo = document.querySelector("#note > .popup > .popup-body span.reminder-info"); 
   if(reminderInfo == null) {
        reminderInfo = document.createElement('span');
        reminderInfo.classList.add('reminder-info')
        let labelInfoElem = null;
        for(let elem of popupBody.children)
            if(elem.classList.contains("label-info-container")) {
                labelInfoElem = elem;
                break;    
            }
        popupBody.insertBefore( reminderInfo, labelInfoElem );
   }
   reminderInfo.innerHTML = `<i class="fa fa-retweet" aria-hidden="true"></i>${reminderInfoStr}<i class = "fa fa-times clearReminder"></i>`
}

colorPalette.addEventListener('click', (event) => {
    popup.style.backgroundColor = event.target.style.backgroundColor;
  })

function  addReminder() {
    reminderContainer.style.display = "initial";
}
  
function  addImage() {
    listContainer.style.display = "none";
    descriptionContainer.style.display = "inherit";
    document.querySelector("#note > .popup > .popup-body  .images-section").style.display = "initial";
    uploadBtnLabel.style.display = "inherit";
}

function  addUser() {
    console.log("added user");
}

function  addList() {
    descriptionContainer.innerText = "";
    descriptionContainer.style.display = "none";
    listContainer.innerHTML = "";
    uploadBtnLabel.style.display = "none";
    uploadedImagesList.innerHTML = ""
    listContainer.appendChild( addListItem() );
    listContainer.style.display = "inherit";
}

function  showOptions() {
    console.log("ptiions")
}

uploadBtn.onchange  = (event) => {
    if(event.target.files && event.target.files.length > 0) {
            renderImages(event.target.files, uploadedImagesList);
    }
}

listContainer.addEventListener("keyup", (event) => {
    if( event.target.parentElement == listContainer.lastElementChild && event.target.innerText.length >= 1) {
        listContainer.appendChild( addListItem() );
    }
});
