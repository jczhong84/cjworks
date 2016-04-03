var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
  username: String,
  word: String,
  freq: Number,
}, { timestamps: true });

var History = mongoose.model('History', historySchema);

module.exports = History;
