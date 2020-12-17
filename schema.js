const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  //title: {type: String, required: true},
  comments: [String],
  title: {type: String, required: true},
  commentcount: {type: Number, default: 0}
});

module.exports = mongoose.model('bookSchema', bookSchema);