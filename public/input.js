const inputHeader = document.querySelector("section.container header.input-header");
const inputBtn = document.querySelector("section.container header.input-header .input-tab-btn");
const inputTab = document.querySelector("section.container header.input-header .input-tab");
const listBtn = document.querySelector("#list-button");
const imageBtn = document.querySelector("#image-button");
const listContainer =  document.querySelector("section.container header.input-header .input-tab ul.input-list");
const descriptionContainer = document.querySelector("section.container header.input-header .input-tab > p.description");
const uploadBtn = document.querySelector("section.container header.input-header .input-tab  div.images-section form #myFile");
const uploadedImagesList = document.querySelector("section.container header.input-header .input-tab div.images-section ul.uploaded-images-list");

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
        //     resetInputTab();
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
        descriptionContainer.style.display = "initial";
        console.log("image added");
}

function addDescription() {
        clearDisplay();
        descriptionContainer.style.display = "initial";
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