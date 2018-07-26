var mongoose = require('mongoose');
var dateTime = require('node-datetime');
var dt = dateTime.create();


var imageSchema = mongoose.Schema({
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


var images = module.exports = mongoose.model('Image', imageSchema);

module.exports.addImage = (images, callback) => {
  console.log("inside startup model");
	Images.create(images, callback);
}

//export const Image = mongoose.model<IImageModel>('Image', imageSchema);
