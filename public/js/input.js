import Note from './note.js';
import {saveNote} from './index.js';
import {successMessage, errorMessage, warningMessage} from './message.js';
import { renderImages } from './image-upload.js';

const inputHeader = document.querySelector("section.container header.input-header");
const inputBtn = document.querySelector("section.container header.input-header .input-tab-btn");
const inputTab = document.querySelector("section.container header.input-header .input-tab");
const listBtn = document.querySelector("#list-button");
const imageBtn = document.querySelector("#image-button");
const listContainer =  document.querySelector("section.container header.input-header .input-tab ul.input-list");
const descriptionContainer = document.querySelector("section.container header.input-header .input-tab > p.description");
const uploadBtn = document.querySelector("section.container header.input-header .input-tab  div.images-section form #myFile");
const uploadBtnLabel = document.querySelector("section.container header.input-header .input-tab  div.images-section form label.upload-btn");
const uploadedImagesList = document.querySelector("section.container header.input-header .input-tab div.images-section ul.uploaded-images-list");
const titleContainer = document.querySelector("section.container header.input-header .input-tab > p");
const buttonsTray = document.querySelector("section.container header.input-header .input-tab .buttons-tray ul");
const addNotesBtn = document.querySelector("section.container header.input-header .input-tab .buttons-tray div > button.addNote-btn");
const closeInputTabBtn = document.querySelector("section.container header.input-header .input-tab .buttons-tray div > button.close-input-tab");
const colorPalette = document.querySelector("section.container header.input-header .input-tab .buttons-tray ul.buttons-list li.color-btn > ul.color-palette");
const reminderForm = document.querySelector(" section.container header.input-header .input-tab .buttons-tray ul.buttons-list li.reminder-btn form.reminder-form");
const reminderAndColloboratorSection = document.querySelector(" section.container header.input-header .input-tab .reminder-collaborator-label-info-section");
const reminderContainer = document.querySelector("section.container header.input-header .input-tab .buttons-tray ul.buttons-list li.reminder-btn div.reminder-form-container");

const buttonsTrayFunctions = {
        reminder,
        addUser,
        changeColor,
        addImage,
        addList,
        showOptions
}


inputBtn.style.display = "inherit";
inputTab.style.display = "none";

document.addEventListener('click', (event) => {
    if( inputHeader.contains(event.target) && event.target != closeInputTabBtn ) {
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

            if(event.target == document.querySelector(" section.container header.input-header .input-tab div.reminder-collaborator-label-info-section span.reminder-info .clearReminder") ) {
                resetReminder();
            }
            if(event.target == document.querySelector("section.container header.input-header .input-tab i.fas.fa-thumbtack") ) {
                    let val = event.target.getAttribute("data-value");
                    event.target.setAttribute("data-value", val == "pin"? "unpin" : "pin");
                    if(val == "pin")
                        event.target.classList.add("active");
                    else
                        event.target.classList.remove("active");
            }
        
        

    } 
    else {
        closeInputTab();
    }
})

function resetReminder() {
        reminderForm.elements.date.value = "";
        reminderForm.elements.time.value = "20:00";
        reminderForm.elements.frequency.value = "repeats daily";
        const reminderInfo = document.querySelector(" section.container header.input-header .input-tab div.reminder-collaborator-label-info-section span.reminder-info");
        if(reminderInfo)
        reminderAndColloboratorSection.removeChild(reminderInfo);
        // reminderInfo.style.display = "none"
}

function resetPin() {
        let icon = document.querySelector("section.container header.input-header .input-tab i.fas.fa-thumbtack");
        icon.classList.remove("active");
        icon.setAttribute("data-value", "pin");
}

function closeInputTab() {
        clearDisplay();
        inputBtn.style.display = "inherit";
        inputTab.style.backgroundColor = "";
        inputTab.style.display = "none";
        reminderContainer.style.display = "none";
        resetPin();
        resetReminder();
}

function clearDisplay() {
        listContainer.style.display = "none";
        descriptionContainer.style.display = "none";
        uploadBtnLabel.style.display = "none";
        descriptionContainer.innerText = "";
        listContainer.innerHTML = "";
        uploadedImagesList.innerHTML = "";
        titleContainer.innerText = "";
}

// function addList() {
//         addListItem();
//         listContainer.style.display = "inherit";
// }

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
        listContainer.appendChild( li )
}

function addDescription() {
        descriptionContainer.style.display = "inherit";
}

uploadBtn.onchange = (event) => {
        if(event.target.files && event.target.files.length > 0) {
                renderImages(event.target.files, uploadedImagesList);
        }
        // readURL(event.target)
}

listContainer.addEventListener("keyup", (event) => {
        if( event.target.parentElement == listContainer.lastElementChild && event.target.innerText.length == 1) {
                addListItem();
        }
});

buttonsTray.addEventListener('click', (event) => {
        if(event.target.nodeName == "I") {
                buttonsTrayFunctions[event.target.getAttribute("data-value")]();
        }
})

function  reminder() {
        reminderContainer.style.display = "initial";
}

function  addUser() {
        console.log("added user");
}

function  changeColor() {
        console.log("changed color")
}

function  addImage() {
        listContainer.style.display = "none";
        descriptionContainer.style.display = "inherit";
        uploadBtnLabel.style.display = "inherit";
}

function  addList() {
        descriptionContainer.innerText = "";
        descriptionContainer.style.display = "none";
        listContainer.innerHTML = "";
        uploadBtnLabel.style.display = "none";
        uploadedImagesList.innerHTML = ""
        addListItem();
        listContainer.style.display = "inherit";
}

function  showOptions() {
        console.log("ptiions")
}

colorPalette.addEventListener('click', (event) => {
      inputTab.style.backgroundColor = event.target.style.backgroundColor;
})

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

function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
}

function isPastDate() {
        warningMessage("Past date is not yet made");
        // return ;
}

function createReminder(reminderInfoStr) {
       let reminderInfo = document.querySelector("section.container header.input-header .input-tab div.reminder-collaborator-label-info-section span.reminder-info"); 
       if(reminderInfo == null) {
            reminderInfo = document.createElement('span');
            reminderInfo.classList.add('reminder-info')
       }
       reminderInfo.innerHTML = `<i class="fa fa-retweet" aria-hidden="true"></i>${reminderInfoStr}<i class = "fa fa-times clearReminder"></i>`
       reminderAndColloboratorSection.prepend(reminderInfo);
}

addNotesBtn.onclick = () => {
       const lisList = Array.prototype.slice.call(listContainer.childNodes);
       lisList.splice(-1);
       let list = lisList.filter( li => li.innerText && li.innerText.trim()).map(li => li.innerText);
//        lisList.forEach(li => {
//                list.push(li.innerText);
//        })
       const imagesList = Array.prototype.slice.call(uploadedImagesList.children);
       let images = []
       for(let uploadedImage of imagesList ) {
                images.push( uploadedImage.children[0].src);
       }

       let isPinned = document.querySelector("section.container header.input-header .input-tab i.fas.fa-thumbtack").getAttribute("data-value") == 'unpin'

       let reminderInfoElem = document.querySelector("section.container header.input-header .input-tab div.reminder-collaborator-label-info-section span.reminder-info");
       let reminderInfo = null;
       if(reminderInfoElem != null) {
               reminderInfo = {
                       date: reminderForm.elements.date.value,
                       time: reminderForm.elements.time.value,
                       frequency: reminderForm.elements.frequency.value
               }
       }

       const note = new Note();
       note.setVal('title', titleContainer.innerText.trim());
       note.setVal('description', descriptionContainer.innerText.trim()); 
       note.setVal('backgroundColor',inputTab.style.backgroundColor);
       note.setVal('list', list);
       note.setVal('images', images);
       note.setVal('isPinned', isPinned);
       if(reminderInfoElem)
                note.setVal('reminder', reminderInfo); 
       
        if( note.title || note.description || note.list && note.list.length > 0 || note.images && note.images.length > 0 || note.reminder)
               saveNote(note);
        else
               errorMessage("Cannot save empty note");
       closeInputTab();
}

closeInputTabBtn.onclick = closeInputTab;