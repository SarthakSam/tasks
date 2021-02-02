import { getData } from './index.js';
import { router } from './router.js';

const notePopupVisible = document.querySelector("#note-checkbox");

export function openNote(note) {
    getData(`notes/${note}`)
    .then(res => res.json())
    .then( res => openNotePopup(res.note));
}

function openNotePopup(note) {
    console.log(note);
    notePopupVisible.checked = true;
}

export function closeEditNotePopup() {
    notePopupVisible.checked = false;
    router.navigateTo(router.prevLocation);
}