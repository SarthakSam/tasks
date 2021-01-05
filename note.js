export default class Note {
    constructor() {
        this.title = "";
        this.description = "";
        this.list = [];
        this.images = [];
        this.backgroundColor = "";
    }   

    setVal(key, value) {
        this[key] = value;
    }
    
}