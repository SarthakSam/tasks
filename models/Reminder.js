const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    date: String,
    time: String,
    frequency: String
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;