
const infoCardWidth = 300;
const totalCardsInRow = 4;
// const container = document.querySelector(".container");
let totalCardsCurrentlyInArow = 4;
const verticalMarginBetCards = 10;

function renderCards(cards) {
    const cardsContainer = document.querySelector('.container')
    const fragment = document.createDocumentFragment();
    const cardsList = [];
    cards.forEach( task => {
        const div = document.createElement('div');
        div.innerHTML = task;
        div.classList.add("info-card");
        div.style.width = `${infoCardWidth}px`;
        cardsList.push(div);
        fragment.appendChild(div);
    })
    cardsContainer.appendChild(fragment)
    adjustCardsToScreenSize(cardsList);
    return cardsList;
}

function adjustCardsToScreenSize(cardsList) {
    let noOfCardsInRow = totalCardsInRow;
    let margin = 10;
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    while( noOfCardsInRow * (infoCardWidth + margin) + margin > containerRect.width ) {
        noOfCardsInRow--;
    }
    let extraSpace = containerRect.width - noOfCardsInRow * (infoCardWidth + margin) - margin;
    margin += extraSpace/(noOfCardsInRow + 1); 
    totalCardsCurrentlyInArow = noOfCardsInRow;     
    cardsList.forEach((task, index) => {
        if(index < noOfCardsInRow) {
            task.style.top = verticalMarginBetCards + 60 + 'px';
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
