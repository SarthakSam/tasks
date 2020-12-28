let notes = [
    "study", 
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quasi officia magnam, unde voluptatibus voluptas aspernatur deserunt aut molestias est debitis fuga. Repellendus accusamus optio, quas recusandae ullam quibusdam quia?","netflix",
     "football",
      "bath",
      "brush",
       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quasi officia magnam, unde voluptatibus voluptas aspernatur deserunt aut molestias est debitis fuga. Repellendus accusamus optio, quas recusandae ullam quibusdam quia?"
]

const infoCardWidth = 300;
const totalCardsInRow = 4;
const container = document.querySelector(".container");
let totalCardsCurrentlyInArow = 4;
const verticalMarginBetCards = 10;

function renderCards(cards) {
    const cardsContainer = document.querySelector('.notes')
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
    const container = document.querySelector('.notes');
    const containerRect = container.getBoundingClientRect();
    while( noOfCardsInRow * (infoCardWidth + margin) + margin > containerRect.width ) {
        noOfCardsInRow--;
    }
    // if( noOfCardsInRow == totalCardsCurrentlyInArow)
    //     return;
    let extraSpace = containerRect.width - noOfCardsInRow * (infoCardWidth + margin) - margin;
    margin += extraSpace/(noOfCardsInRow + 1); 
    totalCardsCurrentlyInArow = noOfCardsInRow;     
    cardsList.forEach((task, index) => {
        if(index < noOfCardsInRow) {
            task.style.top = verticalMarginBetCards + 'px';
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
let cardsList = renderCards(notes);
window.addEventListener('resize', () => {
    adjustCardsToScreenSize(cardsList)
});

document.querySelector("#sidebar-btn").addEventListener("click", () => {
    adjustCardsToScreenSize(cardsList)
})

