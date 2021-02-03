import {successMessage, errorMessage, warningMessage} from './message.js';
import { renderData } from './card.js'
import { createLabelTabs } from './sidenav.js';
import { router } from './router.js';

export function getNotes(urlEnd, action) {
    if( !urlEnd ) {
        let location = localStorage.getItem('location');
        urlEnd = `${ !location? '': location}`;
    }
    fetch("http://localhost:3000/" + urlEnd)
    .then( res => res.json())
    .then( res => {
        if(res.status == 200) {
            localStorage.setItem('notes', JSON.stringify(res.notes) );
            // renderData( res.notes );
            renderData();
            if(action) {
                action();
            }
        }
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
            router.navigateTo(router.prevLocation);
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

export function patchNote(id, property, value) {
    let reqBody = {};
    reqBody[property] = value;
    fetch(
        "http://localhost:3000/notes/" + id, {
            body: JSON.stringify(reqBody),
            method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
        }
    ).then( res => res.json())
    .then( res => {
        if(res.status == 200) {
            router.navigateTo(router.prevLocation);
            successMessage("Note updated successfully");
        }
        else {
            errorMessage("Unable to save post")
        }    
    })
    .catch(err => {
        errorMessage("Something went wrong")
    })
}

export function _deleteNote(id) {
    fetch(
        "http://localhost:3000/notes/" + id, {
            method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
        }
    ).then( res => res.json())
    .then( res => {
        if(res.status == 200) {
            router.navigateTo(router.prevLocation);
            successMessage("Note deleted successfully");
        }
        else {
            errorMessage("Unable to delete post")
        }    
    })
    .catch(err => {
        errorMessage("Something went wrong")
    })
}

export function getData(urlEnd) {
    let url = document.location.origin + "/" + urlEnd;
    return fetch(url);
}


export function postData(urlEnd, body) {
    let url = document.location.origin + "/" + urlEnd;
    return fetch(url, {
        body: JSON.stringify(body),
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
    });
}

export function patchData(urlEnd, body) {
    let url = document.location.origin + "/" + urlEnd;
    return fetch(url, {
        body: JSON.stringify(body),
        method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
    });
}

export function deleteData(urlEnd, body) {
    let url = document.location.origin + "/" + urlEnd;
    return fetch(url, {
        body: JSON.stringify(body),
        method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
    });
}


// function init() {
//     getData('labels').then( res => res.json()).then( res => {
//         localStorage.setItem('labels', JSON.stringify( res.labels ) );
//         createLabelTabs();
//     });
//     getNotes("notes");
// }

// init();