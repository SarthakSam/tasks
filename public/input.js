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

const buttonsTrayFunctions = {
        notify,
        addUser,
        changeColor,
        addImage,
        addList,
        showOptions
}


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
            clearDisplay();
            inputBtn.style.display = "inherit";
            inputTab.style.display = "none";
        //     resetInputTab();
    }
    
})

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
        console.log("uloaded");
        readURL(event.target)
}

function readURL(input) {
        if (input.files && input.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function(e) {
                        console.log(e.target.result);
                        const imageContainer = document.createElement("li");
                        const image = document.createElement("img");
                        image.setAttribute('src', e.target.result);
                        image.classList.add("uploaded-image")
                        imageContainer.appendChild(image);
                        uploadedImagesList.append(imageContainer);
                }
                
                reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
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

function  notify() {
        console.log("notified");
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
        addListItem();
        listContainer.style.display = "inherit";
}

function  showOptions() {
        console.log("ptiions")
}
