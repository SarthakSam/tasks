import { getData } from './index.js';

const labelPopupButton = document.querySelector(".navbar .nav-list .fa-tags");

export function renderLabelsPopup() {
    // getData('labels')
    // .then( res => res.json() )
    // .then( res => console.log(res));
    let labels = localStorage.getItem("labels");

}

labelPopupButton.onclick = () => {
    console.log("opend");
}