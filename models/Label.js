const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    labelText: {
        type: String,
        required: true
    }
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Reminder',
    //     default: null
    // }
});

const Label = mongoose.model("Label", labelSchema);
module.exports = Label;