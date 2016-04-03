var mongoose = require('mongoose');

var wordSchema = new mongoose.Schema({
  searchword: { type: String, lowercase: true, unique: true },
  freq: Number,
  entries: [
      {
          word: { type: String, lowercase: true },
          pron: String,
          forms: [String],
          mean: String,
          definitions: [
              {
                  gram: String,
                  sense: [String]
              }
          ]
      }
  ]
});

var Word = mongoose.model('Word', wordSchema);

module.exports = Word;
