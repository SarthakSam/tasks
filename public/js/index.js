async function getNotes() {
    fetch("http://localhost:3000/notes")
    .then( res => res.json())
    .then( res => {
        if(res.status == 200) 
            renderData( res.notes );
        else {
            alert("something went wrong");
            renderData( [] );   
        }
    })
    .catch(err => {
        alert("something went wrong", err);
        renderData([]);
    });  
    // return localStorage.getItem('notes')? JSON.parse(localStorage.getItem('notes')): [];    
}

export function saveNote(note) {
    // let notes = getNotes();
    // notes.push(note);
    // localStorage.setItem('notes', JSON.stringify(notes) );
    // init();
    fetch(
        "http://localhost:3000/notes", {
            body: JSON.stringify(note),
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
        }
    ).then( res => res.json())
    .then( res => {
        if(res.status == 200) 
            getNotes();
        else {
            alert("Unable to save post");
        }    
    })
    .catch(err => {
        alert("Something went wrong");
    })
}

function init() {
    getNotes();
}

init();