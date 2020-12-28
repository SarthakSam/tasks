let tasks = [
    "study", 
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quasi officia magnam, unde voluptatibus voluptas aspernatur deserunt aut molestias est debitis fuga. Repellendus accusamus optio, quas recusandae ullam quibusdam quia?","netflix",
     "football",
      "bath",
      "brush",
       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quasi officia magnam, unde voluptatibus voluptas aspernatur deserunt aut molestias est debitis fuga. Repellendus accusamus optio, quas recusandae ullam quibusdam quia?"
]

const taskCardWidth = 300;
const totalCardsInRow = 4;
let totalCardsCurrentlyInArow = 4;
const verticalMarginBetCards = 10;

function renderTasks(tasks) {
    const tasksContainer = document.querySelector('.notes')
    const fragment = document.createDocumentFragment();
    const tasksCardList = [];
    tasks.forEach( task => {
        const div = document.createElement('div');
        div.innerHTML = task;
        div.classList.add("task");
        div.style.width = `${taskCardWidth}px`;
        tasksCardList.push(div);
        fragment.appendChild(div);
    })
    tasksContainer.appendChild(fragment)
    adjustTaskCardToScreenSize(tasksCardList);
    return tasksCardList;
}

function adjustTaskCardToScreenSize(tasksCardList) {
    let noOfCardsInRow = totalCardsInRow;
    let margin = 10;
    const container = document.querySelector('.notes');
    const containerRect = container.getBoundingClientRect();
    while( noOfCardsInRow * (taskCardWidth + margin) + margin > containerRect.width ) {
        noOfCardsInRow--;
    }
    // if( noOfCardsInRow == totalCardsCurrentlyInArow)
    //     return;
    let extraSpace = containerRect.width - noOfCardsInRow * (taskCardWidth + margin) - margin;
    margin += extraSpace/(noOfCardsInRow + 1); 
    totalCardsCurrentlyInArow = noOfCardsInRow;     
    tasksCardList.forEach((task, index) => {
        if(index < noOfCardsInRow) {
            task.style.top = verticalMarginBetCards + 'px';
        }
        else {
            const top = tasksCardList[index - noOfCardsInRow].getBoundingClientRect().bottom - containerRect.top + verticalMarginBetCards;
            task.style.top = `${top}px`;
        }
        if(index % noOfCardsInRow == 0) {
            task.style.left = `${margin}px`;
        }
        else {
            const left = tasksCardList[index - 1].getBoundingClientRect().right - containerRect.left + margin;
            task.style.left = `${left}px`;
        }
    });
}
let tasksCardList = renderTasks(tasks);
window.addEventListener('resize', () => {
    adjustTaskCardToScreenSize(tasksCardList)
});

