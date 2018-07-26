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
  },
  filename:{
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: dt.format('Y-m-d H:M:S')
  }
});

var startups = module.exports = mongoose.model('Startups', startupSchema);

// Get Messages

module.exports.getStartups = function(callback, limit) {
    console.log("inside get startups");
    startups.find(callback);
}

module.exports.addStartup = (startups, callback) => {
  console.log("inside startup model");
	Startups.create(startups, callback);
}
