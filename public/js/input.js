import Note from './note.js';
import {saveNote} from './index.js';

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
const reminderAndCollobarotorSection = document.querySelector(" section.container header.input-header .input-tab .reminder-collaborator-section");
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

    } 
    else {
        closeInputTab();
    }
    if(event.target == document.querySelector(" section.container header.input-header .input-tab div.reminder-collaborator-section span.reminder-info .clearReminder") ) {
        reminderForm.elements.date.value = "";
        reminderForm.elements.time.value = "20:00";
        reminderForm.elements.frequency.value = "daily";
        const reminderInfo = document.querySelector(" section.container header.input-header .input-tab div.reminder-collaborator-section span.reminder-info");
        reminderAndCollobarotorSection.removeChild(reminderInfo);
        // reminderInfo.style.display = "none"
    }

})

function closeInputTab() {
        clearDisplay();
        inputBtn.style.display = "inherit";
        // if(inputTab)
        inputTab.style.backgroundColor = "";
        inputTab.style.display = "none";
        reminderContainer.style.display = "none";
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
                renderImages(event.target.files);
        }
        // readURL(event.target)
}

async function renderImages(files) {
        var reader = new FileReader();
        files = Array.prototype.slice.call(files);
        for( const file of files)
                await renderImage(reader, file);
}

function renderImage(reader, file) {
        let promise = new Promise( (resolve, reject) => {
                reader.onload = function(e) {
                        // console.log(e.target.result);
                        const imageContainer = document.createElement("li");
                        const image = document.createElement("img");
                        image.setAttribute('src', e.target.result);
                        image.classList.add("uploaded-image")
                        imageContainer.appendChild(image);
                        uploadedImagesList.append(imageContainer);
                        resolve();
                        }
        })
        reader.readAsDataURL(file);
        return promise;
}

// function readURL(input) {
//         if (input.files && input.files.length > 0) {
//                 renderImages(images.files);
//                 // var reader = new FileReader();
//                 // reader.onload = function(e) {
//                 //         // console.log(e.target.result);
//                 //         const imageContainer = document.createElement("li");
//                 //         const image = document.createElement("img");
//                 //         image.setAttribute('src', e.target.result);
//                 //         image.classList.add("uploaded-image")
//                 //         imageContainer.appendChild(image);
//                 //         uploadedImagesList.append(imageContainer);
//                 // }
//                 // const files = Array.prototype.slice.call(input.files);
//                 // files.forEach( file => {
//                 //         reader.readAsDataURL(file); // convert to base64 string                        
//                 // })

//                 // const formData = new FormData();                
//                 // formData.append('images', input.files[0]);

//                 // fetch(
//                 //         "http://localhost:3000/note", {
//                 //                 method: 'POST',
//                 //                 body: formData,
//                 //         }
//                 // ).then( res => res.json()).then( resp => console.log(resp))

//                 // fetch(
//                 //         "http://localhost:3000/note", {
//                 //         body: input.files[0],
//                 //         method: 'POST',
//                 //         headers: {
//                 //                 'Content-Type': 'application/x-www-form-urlencoded',
//                 //                 }
//                 //         }
//                 //         ).then( res => res.json()).then( resp => console.log(resp))
//         }
// }        

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
        createReminder(reminderInfoStr + ", " + time);
        reminderContainer.style.display = "none";
})

function isPastDate() {
        alert("Past date is not yet made")
        // return ;
}

function createReminder(reminderInfoStr) {
       let reminderInfo = document.createElement('span');
       reminderInfo.innerHTML = `<i class="fa fa-retweet" aria-hidden="true"></i>${reminderInfoStr}<i class = "fa fa-times clearReminder"></i>`
       reminderInfo.classList.add('reminder-info')
       reminderAndCollobarotorSection.prepend(reminderInfo);
}
addNotesBtn.onclick = () => {
       const lisList = Array.prototype.slice.call(listContainer.childNodes);
       lisList.splice(-1);
       let list = lisList.filter( li => li.innerText).map(li => li.innerText);
//        lisList.forEach(li => {
//                list.push(li.innerText);
//        })
       const imagesList = Array.prototype.slice.call(uploadedImagesList.children);
       let images = []
       for(let uploadedImage of imagesList ) {
                images.push( uploadedImage.children[0].src);
       }

       const note = new Note();
       note.setVal('title', titleContainer.innerText);
       note.setVal('description', descriptionContainer.innerText); 
       note.setVal('backgroundColor',inputTab.style.backgroundColor);
       note.setVal('list', list);
       note.setVal('images', images);
       saveNote(note);
       closeInputTab();
}

closeInputTabBtn.onclick = closeInputTab;