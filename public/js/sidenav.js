import { getNotes } from './index.js';

const sideNav = document.querySelector("aside.sidebar ul");
sideNav.addEventListener('click', (event) => {
    const li = event.target.tagName == 'LI'? event.target : event.target.parentElement;
    removeClass(document.querySelectorAll("aside.sidebar ul li"), "active");
    li.classList.add("active");
    document.location.hash = li.getAttribute("data-value");
    localStorage.setItem('location', document.location.hash.substring(1) );
    getNotes( li.getAttribute("data-value") );
})

function removeClass(list, className) {
    list = Array.prototype.slice.apply(list);
    list.forEach(element => {
        element.classList.remove(className);
    });
}

export function createLabelTabs( ) {
    let labels = JSON.parse( localStorage.getItem('labels') );
    const fragment = document.createDocumentFragment();
    const ul = document.querySelector("aside.sidebar").childNodes[1];

    labels.forEach( label => {
        const li = document.createElement("li");
        li.setAttribute("data-value", `labels/${label._id}`);
        li.innerHTML = "<i class='fas fa-tag'></i>"

        const span = document.createElement("span");
        span.innerText = label.labelText;
        li.appendChild(span);
        fragment.appendChild(li);
    })

    ul.insertBefore(fragment, ul.children[2]);
}