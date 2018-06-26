var mongoose = require('mongoose');
var dateTime = require('node-datetime');
var dt = dateTime.create();
//words Schema

var startupSchema = mongoose.Schema({
  startupname:{
    type: String,
    required: true
  },
  startupvision: {
    type: String,
    required: true
  },
  startupmission: {
    type: String,
    required: true
  },
  startupproblem: {
    type: String,
    required: true
  },
  startupsolution: {
    type: String,
    required: true
  },
  startupdescription: {
    type: String,
    required: true
  },
  startupurl: {
    type: String,
    required: true
  }
});

var startups = module.exports = mongoose.model('Startups', startupSchema);

// Get Messages

// startupSchema.getmessages = function(callback, limit) {
//     Messages.find(callback);
// }

module.exports.addStartup = (startups, callback) => {
  console.log("inside startup model");
	Startups.create(startups, callback);
}
