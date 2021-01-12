
function render(message, color) {
    let div = document.createElement('div');
    div.innerText = message;
    div.style.border = `1px solid ${color}`;
    div.style.color = color
    div.classList.add("message");
    document.body.appendChild(div);
    setTimeout( () => {
        div.style.opacity = 0;
    } ,3000);
    setTimeout( () => {
        document.body.removeChild(div);        
    }, 4000);
}

export function successMessage( message ) {
    render(message, 'green');
}

export function errorMessage( message ) {
    render(message, 'red');
}

export function warningMessage( message ) {
    render(message, 'orange');
}