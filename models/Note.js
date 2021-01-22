const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: String,
    description: String,
    list: [String],
    date: { type: Date, default: Date.now },
    images: [String],
    backgroundColor: { type: String, default: Date.now },
    isPinned: Boolean,
    status: { type: Number, default: 0 },
    reminder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reminder',
      default: null
    }
  })
  
const Note = mongoose.model("Note", noteSchema);
  
module.exports = Note;