
const infoCardWidth = 300;
const totalCardsInRow = 4;
// const container = document.querySelector(".container");
let totalCardsCurrentlyInArow = 4;
const verticalMarginBetCards = 10;

function renderCards(cards) {
    const cardsContainer = document.querySelector('.container main')
    const fragment = document.createDocumentFragment();
    const cardsList = [];
    cards.forEach( task => {
        const taskDiv = createTaskCard( task );
        // const div = document.createElement('div');
        // div.innerHTML = task;
        // div.classList.add("info-card");
        taskDiv.style.width = `${infoCardWidth}px`;
        cardsList.push(taskDiv);
        fragment.appendChild(taskDiv);
    })
    cardsContainer.appendChild(fragment)
    adjustCardsToScreenSize(cardsList);
    return cardsList;
}

function createTaskCard( task ) {
    const div = document.createElement('div');
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
        task.list.forEach( task => {
            const li = document.createElement("li");
            li.innerText = task;
            ul.appendChild(li);
        });
        div.appendChild(ul)
    }
    div.classList.add("info-card");
    return div;
}

function adjustCardsToScreenSize(cardsList) {
    let noOfCardsInRow = totalCardsInRow;
    let margin = 10;
    const container = document.querySelector('.container main');
    const containerRect = container.getBoundingClientRect();
    while( noOfCardsInRow * (infoCardWidth + margin) + margin > containerRect.width ) {
        noOfCardsInRow--;
    }
    let extraSpace = containerRect.width - noOfCardsInRow * (infoCardWidth + margin) - margin;
    margin += extraSpace/(noOfCardsInRow + 1); 
    totalCardsCurrentlyInArow = noOfCardsInRow;     
    cardsList.forEach((task, index) => {
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

function renderData(data) {
    let cardsList = renderCards(data);
    window.addEventListener('resize', () => {
        adjustCardsToScreenSize(cardsList)
    });
    
    document.querySelector("#sidebar-btn").addEventListener("click", () => {
        adjustCardsToScreenSize(cardsList)
    })
    
}
