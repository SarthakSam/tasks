function getNotes() {
    return localStorage.getItem('notes')? JSON.parse(localStorage.getItem('notes')): [];
    // let notes = [
    //     {
    //         backgroundColor: "",
    //         description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci nisi soluta libero animi consequuntur repellat error veniam aperiam aliquam ipsa, incidunt reiciendis qui quaerat, nostrum magni illum sequi vitae sunt.",
    //         images: [],
    //         list: ["abjcbvw ", "bwveve", "cwwvwvw", "dcwcw"],
    //         title: "first"
    //     }, 
    //     {
    //         backgroundColor: "",
    //         description: "tur repellat error veniam aperiam aliquam ipsa, incidunt r",
    //         images: [],
    //         list: ["a", "b", "c", "d"],
    //         title: "second"
    //     },
    //     {
    //         backgroundColor: "",
    //         description: "tur repellat error veniam aperiam aliquam ipsa, incidunt r",
    //         images: [],
    //         list: ["a", "b", "c", "d"],
    //         title: "lorem30"
    //     },
    //     {
    //         backgroundColor: "",
    //         description: "",
    //         images: [],
    //         list: ["a", "b", "c", "d"],
    //         title: "first"
    //     },
    // ]
    // return notes;
}

export function saveNote(note) {
    let notes = getNotes();
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes) );
    init();
    fetch(
        "http://localhost:3000/note", {
            body: JSON.stringify(note),
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
        }
    ).then( res => res.text()).then( resp => console.log(resp))
}

function init() {
    let notes = getNotes();
    renderData(notes);
}

init();

function getDataFromBackend() {
    fetch(
        "http://localhost:3000/note", {
            body: JSON.stringify({name: "Sam" }),
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
        }
    ).then( res => res.text()).then( resp => console.log(resp))
}