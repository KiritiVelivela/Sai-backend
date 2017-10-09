var mongoose = require('mongoose');

//words Schema

var wordsSchema = mongoose.Schema({
  message:{
    type: String,
    required: true
  },
  toemail: {
    type: String,
    required: true
  },
  fromemail: {
    type: String,
    required: true
  },
  time: {
    type: DateTime.now(),
    required: true
  }
});

var messages = module.exports = mongoose.model('Messages', wordsSchema);

// Get Messages

module.exports.getmessages = function(callback, limit) {
    Words.find(callback);
}

module.exports.add = (message, callback) => {
	Words.create(message, callback);
}
