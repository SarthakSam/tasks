import {patchNote, _deleteNote, postData, patchData, deleteData, getNotes } from './index.js';
import { errorMessage, successMessage } from './message.js';
import { router } from './router.js';

const maxCardWidth = 300;
const totalCardsInRow = 4;
let totalCardsCurrentlyInArow = 4;
const verticalMarginBetCards = 10;
const container = document.querySelector("main.notes");
let cards = [];

function initializeCardsData() {
    cards = localStorage.getItem('notes')? JSON.parse(localStorage.getItem('notes')): [];
}

function saveChangesInStore(index, card) {
    cards[index] = card;
    localStorage.setItem('notes', JSON.stringify(cards) );
}

function renderCards() {
    initializeCardsData();
    let pinnedTask = cards.filter( card => card.isPinned);
    let unpinnedTask = cards.filter( card => !card.isPinned);
    cards = [...pinnedTask, ...unpinnedTask];
    const cardsContainer = document.querySelector('.container main')
    cardsContainer.innerHTML = ""; 
    const fragment = document.createDocumentFragment();
    const cardsList = [];
    cards.forEach( (task, index) => {
        const taskDiv = createTaskCard( task );
        taskDiv.setAttribute("data-index", index);
        // const div = document.createElement('div');
        // div.innerHTML = task;
        // div.classList.add("info-card");
        cardsList.push(taskDiv);
        fragment.appendChild(taskDiv);
    })
    cardsContainer.appendChild(fragment)
    adjustCardsToScreenSize(cardsList);
    return cardsList;
}

function createTaskCard( task ) {
    const div = document.createElement('div');
    const pinIcon = document.createElement("i");
    pinIcon.classList.add("fas")
    pinIcon.classList.add("fa-thumbtack")
    pinIcon.classList.add("list-icon-right")
    switchisPinned(pinIcon, task.isPinned);
    div.appendChild(pinIcon);
        
    if(task.title) {
        const title = document.createElement('p');
        title.innerText = task.title
        title.classList.add('title');
        div.appendChild(title);
    }
    if(task.description) {
        const description = document.createElement('p');
        description.innerText = task.description
        description.classList.add('description');
        div.appendChild(description)
    }
    if(task.list && task.list.length > 0) {
        const ul = document.createElement("ul");
        ul.classList.add("info-list");
        task.list.forEach( task => {
            const li = document.createElement("li");
            li.innerText = task;
            ul.appendChild(li);
        });
        div.appendChild(ul)
    }
    if(task.images && task.images.length > 0) {
        const ul = document.createElement("ul");
        ul.classList.add("uploaded-images-list");
        task.images.forEach( task => {
            const li = document.createElement("li");
            const image = document.createElement("img");
            image.setAttribute('src', task);
            image.classList.add("uploaded-image")
            li.appendChild(image);
            ul.appendChild(li);
        });
        div.appendChild(ul)
    }
    div.style.backgroundColor = task.backgroundColor;
    div.classList.add("info-card");
    if(task.reminder && task.reminder.date)
        div.append( getReminderElement( task.reminder ) );
    div.appendChild( getLabel(task.labels) );
    div.appendChild( getCardButtons() );
    return div;
}

function getLabel(labels=[]) {
    const div = document.createElement('div');
    div.classList.add("label-info-container");
    labels.forEach( label => {
        div.appendChild( getLabelElement(label) );
    });
    return div;
}

function getReminderElement(reminderInfo) {
    let reminderInfoElem = document.createElement('span');
    reminderInfoElem.classList.add('reminder-info')
    reminderInfoElem.setAttribute("data-val", reminderInfo._id);
    reminderInfoElem.innerHTML = `<i class="fa fa-retweet" aria-hidden="true"></i>${reminderInfo.date + ", " + reminderInfo.time + ", " + capitalize(reminderInfo.frequency) }<i class = "fa fa-times clearReminder"></i>`
    return reminderInfoElem;
}

function getCardButtons() {
    const ul = document.createElement("ul");
    const icons = [["far", "fa-bell"], ["fas", "fa-user-plus"], ["fas", "fa-palette"], ["far", "fa-image"], ["fa", "fa-check-square"], ["fas", "fa-ellipsis-v"]];
    icons.forEach(iconArr => {
        const li = document.createElement("li");
        const i = document.createElement("i");
        i.classList.add(iconArr[0]);
        i.classList.add(iconArr[1]);
        li.appendChild(i);
        ul.appendChild(li);
    });
    ul.classList.add("card-buttons");
    return ul;
}

function adjustCardsToScreenSize(cardsList) {
    let noOfCardsInRow = totalCardsInRow;
    let infoCardWidth = maxCardWidth;
    let margin = 10;
    const container = document.querySelector('.container main');
    const containerRect = container.getBoundingClientRect();
    if( containerRect.width <= infoCardWidth ) {
        infoCardWidth = containerRect.width
        noOfCardsInRow = 1;
    }
    else {
        while( noOfCardsInRow * (infoCardWidth + margin) + margin > containerRect.width ) {
            noOfCardsInRow--;
        }
        let extraSpace = containerRect.width - noOfCardsInRow * (infoCardWidth + margin) - margin;
        margin += extraSpace/(noOfCardsInRow + 1); 
        totalCardsCurrentlyInArow = noOfCardsInRow;     
    }

    cardsList.forEach((task, index) => {
        task.style.width = `${infoCardWidth}px`;
        if(index < noOfCardsInRow) {
            task.style.top = verticalMarginBetCards + verticalMarginBetCards + 'px';
        }
        else {
            const prevCard = cardsList[index - noOfCardsInRow].getBoundingClientRect();
            const top = prevCard.bottom - containerRect.top + verticalMarginBetCards;
            task.style.top = `${top}px`;
        }
        if(index % noOfCardsInRow == 0) {
            task.style.left = `${margin}px`;
        }
        else {
            const left = cardsList[index - 1].getBoundingClientRect().right - containerRect.left + margin;
            task.style.left = `${left}px`;
        }
    });
}

export function renderData(data) {
    let cardsList = renderCards(data);
    window.addEventListener('resize', () => {
        adjustCardsToScreenSize(cardsList)
    });
    
    document.querySelector("#sidebar-btn").addEventListener("click", () => {
        adjustCardsToScreenSize(cardsList)
    })
    
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('click', (event) => {
    removeMenuAndListOpacity();
    removeLabelsMenu(event);
    if( container.contains( event.target ) && event.target !== container) {
       if( event.target.classList.contains("fa-thumbtack") ) {
            let val = event.target.getAttribute("data-value");
            let index = +event.target.parentNode.getAttribute("data-index");
            switchisPinned(event.target, val == "pin");
            patchNote(cards[index]._id, 'isPinned', val == "pin" );
       }
       else if( event.target.classList.contains("fa-ellipsis-v") ) {
            let iconsList = event.target.parentNode.parentNode;
            iconsList.classList.add("focus");
            event.target.parentNode.appendChild(createMenu(iconsList.parentNode))
       }
       else if( event.target.classList.contains("fa-bell") ) {

       }
       else if( event.target.classList.contains("fa-user-plus") ) {

        }
        else if( event.target.classList.contains("fa-palette") ) {

        }
        else if( event.target.classList.contains("fa-image") ) {

        }
        else if( event.target.classList.contains("fa-check-square") ) {

        }
        else if( event.target.classList.contains("clearLabel") ) {
            console.log("deleted label info");
        }
        else if( event.target.parentElement?.classList.contains("label-info") ) {
            console.log("label info");
        }
        else if( event.target.classList.contains("clearReminder") ) {
            deleteData(`reminders/${event.target.parentElement.getAttribute("data-val")}`)
            .then( res => res.json() )
            .then( res => {
                successMessage(res.message);
                getNotes();
            })
            .catch( err => {
                errorMessage(err.message);
            })
        }
        else if( event.target.classList.contains("reminder-info") || event.target.parentElement?.classList.contains("reminder-info")) {
            console.log("remainer info");
        }
        else {
            let card = event.target;
            while( !card.classList.contains( "info-card" ) )
                card = card.parentElement;
            router.navigateTo(`note/${cards[+card.getAttribute("data-index")]._id }`);
        }
    }
    else {
    }
} )

function removeMenuAndListOpacity() {
    let buttonsMenu = document.querySelector(".info-card .buttons-menu");
    if( !buttonsMenu )
        return;
    let iconsList = buttonsMenu.parentNode.parentNode;
    buttonsMenu.parentNode.removeChild(buttonsMenu);
    iconsList.classList.remove("focus");
}

function removeLabelsMenu(event) {
    const labelsMenu = document.querySelector(".info-card .labels-menu");
    if( labelsMenu && !labelsMenu.contains(event.target) && event.target.innerText !== "Add Label") {
        labelsMenu.parentNode.removeChild(labelsMenu);
    }
    return;
}

function switchisPinned(elem, val) {
    if(val) {
        elem.classList.add("active");
        elem.setAttribute("data-value", "unpin");
    } else {
        elem.classList.remove("active",);
        elem.setAttribute("data-value", "pin");
    }
}

function createMenu(card) {
    const div = document.createElement('div');
    div.classList.add("buttons-menu");
    const ul = document.createElement('ul');
    div.appendChild(ul);
    const menuItems = [
        { 
            label: "Add Label", action: renderLabelMenu
        },
        { 
            label: "Delete Note", action: deleteNote
        },
        { 
            label: "Archive", action: archive
        }
    ]        
    menuItems.forEach(menuItem => {
        const li = document.createElement("li");
        li.innerText = menuItem.label;
        li.onclick = () => { menuItem.action(card) };
        ul.appendChild(li);
    })
    return div;
}

function renderLabelMenu(card) {
    console.log("label addded");
    const div = document.createElement("div");
    div.classList.add("labels-menu");

    let p1 = document.createElement("p");
    p1.innerHTML = "Label note";
    div.appendChild(p1);

    
    let labelInputContainer = document.createElement("div");
    labelInputContainer.classList.add("label-input-container");
    div.appendChild(labelInputContainer);

    let p2 = document.createElement("p");
    // p2.innerHTML = "Label note";
    p2.setAttribute("contenteditable", true);
    p2.classList.add("label-input");
    p2.onkeyup = newLabelAndFilterLabels;
    labelInputContainer.appendChild(p2);
    
    const i = document.createElement("i");
    i.classList.add("fas");
    i.classList.add("fa-search");
    labelInputContainer.appendChild(i);

    let labels = JSON.parse(localStorage.getItem('labels'));

    const ul = document.createElement("ul");
    ul.onclick = labelSelected;
    ul.classList.add("labels-list")
    labels.forEach((labelObj, index) => {
        const li = document.createElement("li");
        ul.appendChild(li);

        const checkBox = document.createElement("input");
        const id = `check-${index}`;
        checkBox.id = id;
        li.appendChild(checkBox);
        checkBox.setAttribute("type", "checkbox");

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.innerHTML = labelObj.labelText;
        li.appendChild(label);
    });
    div.appendChild(ul);

    let iconsList = card.lastChild;
    iconsList.style.opacity = "1";
    const menuIcon = iconsList.lastChild;
    menuIcon.appendChild(div);
}

function labelSelected(event) {
    if(event.target.nodeName === "INPUT") {
        console.log(event.target)
    }
}

function newLabelAndFilterLabels(event) {
    const labelsMenu = document.querySelector(".info-card .labels-menu");
    const newLabelButton = document.querySelector(".info-card .labels-menu button.new-label");
    if(event.target.innerText.length == 0) {
        if(newLabelButton) {
            labelsMenu.removeChild(newLabelButton);
        }
    }
    else {
        if( !newLabelButton ) {
            const button = document.createElement("button");
            button.innerHTML = "<i class='fa fa-plus'></i> Create label";
            button.classList.add("new-label");
            button.onclick = createNewLabel;
            labelsMenu.appendChild(button);
        }
    }
}

function addLabelToCard( card, label ) {
    let container = null;
    for(let child of card.childNodes) {
        if( child.classList.contains("label-info-container")) {
            container = child;
            break;
        }
    }
    container.appendChild( getLabelElement( label ) );
}

function getLabelElement( label ) {
    let labelInfoElem = document.createElement('div');
    labelInfoElem.classList.add('label-info')
    labelInfoElem.innerHTML = `<span> ${label.labelText} </span><i class = "fa fa-times clearLabel"></i>`
    return labelInfoElem;
}

function createNewLabel() {
   let newLabel = document.querySelector(".info-card .labels-menu .label-input-container .label-input");
   const cardElem = newLabel.parentNode.parentNode.parentNode.parentNode.parentNode;
   const card = cards[+cardElem.getAttribute("data-index")];
   if(newLabel) {
       postData( "labels", { id: card._id, label: newLabel.innerText })
       .then( res => res.json() )
       .then( res1 => {
           if(res1.status == 200) {
               let labels = card.labels.map(label => label._id);
               let label = res1.label;
               labels.push(label);
               patchData( `notes/${ card._id }` , { labels } )
               .then( res => res.json() )
               .then( res2 => {
                   successMessage(res2.message);
                   card.labels.push(label);
                   saveChangesInStore('cards', +cardElem.getAttribute("data-index"), { ...cards[+cardElem.getAttribute("data-index")] });
                   initializeCardsData();
                   addLabelToCard(cardElem, label);
               })
           }
            
       })
       .catch(err => {
           errorMessage(err.message);
       })
   } 
}

function deleteNote(card) {
    let index = +card.getAttribute('data-index');
    _deleteNote(cards[index]._id);
}

function archive(card) {
    let index = +card.getAttribute('data-index');
    patchNote(cards[index]._id, 'status',  1 );
}