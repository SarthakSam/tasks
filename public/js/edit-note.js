import { getNotes } from './index.js'

export function openNote(note) {
    getNotes("notes", openNotePopup.bind(null, note));
}

function openNotePopup(noteId) {
    let notes = JSON.parse( localStorage.getItem("notes") );
    let note = notes.filter( note => note._id == noteId )[0];
    console.log(note);

    
}