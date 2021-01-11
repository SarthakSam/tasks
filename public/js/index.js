import {successMessage, errorMessage, warningMessage} from './message.js';

async function getNotes() {
    fetch("http://localhost:3000/notes")
    .then( res => res.json())
    .then( res => {
        if(res.status == 200) 
            renderData( res.notes );
        else {
            errorMessage("something went wrong")
            renderData( [] );   
        }
    })
    .catch(err => {
        errorMessage("something went wrong" + err)
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
        if(res.status == 200) {
            getNotes();
            successMessage("Note saved successfully");
        }
        else {
            errorMessage("Unable to save post")
        }    
    })
    .catch(err => {
        errorMessage("Something went wrong")
    })
}

function init() {
    getNotes();
}

init();