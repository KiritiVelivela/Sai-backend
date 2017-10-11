var mongoose = require('mongoose');
var dateTime = require('node-datetime');
var dt = dateTime.create();
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
    type: Date,
    default: dt.format('Y-m-d H:M:S')
  }
});

var messages = module.exports = mongoose.model('Messages', wordsSchema);

// Get Messages

wordsSchema.getmessages = function(callback, limit) {
    Messages.find(callback);
}

module.exports.add = (message, callback) => {
	Words.create(message, callback);
}
