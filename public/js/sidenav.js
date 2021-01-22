import { getNotes } from './index.js';

const sideNav = document.querySelector("aside.sidebar ul");
sideNav.addEventListener('click', (event) => {
    const li = event.target.tagName == 'LI'? event.target : event.target.parentElement;
    removeClass(document.querySelectorAll("aside.sidebar ul li"), "active");
    li.classList.add("active");
    document.location.hash = li.getAttribute("data-value");
    getNotes( li.getAttribute("data-value") );
})

function removeClass(list, className) {
    list = Array.prototype.slice.apply(list);
    list.forEach(element => {
        element.classList.remove(className);
    });
}