import { getNotes, getData } from './index.js';
import { warningMessage } from './message.js';
import { router } from './router.js';

const sideNav = document.querySelector("aside.sidebar ul");
sideNav.addEventListener('click', (event) => {
    const li = event.target.tagName == 'LI'? event.target : event.target.parentElement;
    removeClass(document.querySelectorAll("aside.sidebar ul li"), "active");
    li.classList.add("active");
    router.navigateTo( li.getAttribute("data-value") );
})

function removeClass(list, className) {
    list = Array.prototype.slice.apply(list);
    list.forEach(element => {
        element.classList.remove(className);
    });
}

export function createLabelTabs( ) {
    let labelsArr = document.querySelectorAll("aside.sidebar > ul .labels-list-item");
    for( let label of labelsArr) 
        label.parentNode.removeChild(label);

    let labels = JSON.parse( localStorage.getItem('labels') );
    const fragment = document.createDocumentFragment();
    const ul = document.querySelector("aside.sidebar").childNodes[1];

    labels.forEach( label => {
        const li = document.createElement("li");
        li.setAttribute("data-value", `labels/${label._id}`);
        li.innerHTML = "<i class='fas fa-tag'></i>"
        li.classList.add("labels-list-item");

        const span = document.createElement("span");
        span.innerText = label.labelText;
        li.appendChild(span);
        fragment.appendChild(li);
    })

    ul.insertBefore(fragment, ul.children[2]);
}

export function renderLabels() {
    getData('labels')
    .then( res => res.json())
    .then( res => {
        localStorage.setItem('labels', JSON.stringify( res.labels ) );
        createLabelTabs();
        setActiveLabel();
    })
    .catch( err => warningMessage(err.message));
}

function setActiveLabel() {
    let lis = document.querySelectorAll("aside.sidebar ul li");
    removeClass(lis, "active");
    for( let li of lis) {
        if( li.getAttribute("data-value") == router.currentLocation) {
            li.classList.add("active");
            break;
        }
    }
}