const sideNav = document.querySelector("aside.sidebar ul");
sideNav.addEventListener('click', (event) => {
    const li = event.target.tagName == 'LI'? event.target : event.target.parentElement;
    removeClass(document.querySelectorAll("aside.sidebar ul li"), "active");
    li.classList.add("active");
    getData( li.getAttribute("data-value") );
})

function removeClass(list, className) {
    list = Array.prototype.slice.apply(list);
    list.forEach(element => {
        element.classList.remove(className);
    });
}

function getData(page) {
    let notes = [
        "study", 
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quasi officia magnam, unde voluptatibus voluptas aspernatur deserunt aut molestias est debitis fuga. Repellendus accusamus optio, quas recusandae ullam quibusdam quia?","netflix",
         "football",
          "bath",
          "brush",
           "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quasi officia magnam, unde voluptatibus voluptas aspernatur deserunt aut molestias est debitis fuga. Repellendus accusamus optio, quas recusandae ullam quibusdam quia?"
    ]
    renderData(notes);

}

getData();