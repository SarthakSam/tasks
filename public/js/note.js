export default class Note {
    constructor() {
        this.title = "";
        this.description = "";
        this.list = [];
        this.images = [];
        this.backgroundColor = "";
        this.isPinned = false;
    }   

    setVal(key, value) {
        this[key] = value;
    }
    
}