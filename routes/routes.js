var express = require('express');
var actions = require('../methods/actions');
var multer = require('multer');
var Image = require('../model/images');
var fs = require('fs');
var path = require('path');

let UPLOAD_PATH = module.exports = 'uploads';
    // Multer Settings for file upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
let upload = module.exports = multer({ storage: storage });

var router = express.Router();




router.post('/authenticate', actions.authenticate);
router.post('/adduser', actions.addNew);
router.get('/getinfo', actions.getinfo);
router.get('/getu', actions.getu);
router.get('/send', actions.send);
router.get('/verify', actions.verify);
router.get('/all', actions.getAllImg);
// router.get('/oneImg/:id', actions.getOneImg);
router.post('/upload', upload.any(), actions.addImage);



// Get one image by its ID
router.get('/images/:id', (req, res, next) => {
    let imgId = req.params.id;
    console.log(imgId);
    console.log("one id img");
    Image.findById(imgId, (err, image) => {
        if (err) {
            res.sendStatus(400);
        }
        // stream the image back by loading the file
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
    })
});
// router.post('/upload', upload.any(), function(req, res, next) {
//   console.log(req.body, 'Body');
//   console.log(req.files, 'files');
//   res.end();
// });
// router.post('/uploadddd', upload.any(), function(req, res, next) {
//   console.log(req.body, 'Body');
//   console.log(req.files, 'files');
//   console.log("Inside upload IMG1");
//   res.end();
//   var newImage = Image({
//       filename: req.body.startupname,
//       originalName: req.body.startupvision,
//       created: req.body.startupmission,
//       path: req.body.path
//   });
//
//   newImage.save(function(err, newImage){
//       if (err){
//           res.json({success:false, msg:'Failed to save'})
//       }
//
//       else {
//           // res.json({success:true, msg:'Successfully saved'});
//           res.json({success:true, msg: 'Image Sucessfully uploaded'});
//       }
//   });
// });

router.put('/sendup', actions.sendup);
// router.post('/sendmessage', actions.addmessage);
router.post('/getmsg', actions.getmsgs);
router.post('/addstartup', actions.addStartup);
router.get('/getstartups', actions.getStartups);
router.delete('/delstartups/:id', actions.delStartups);








module.exports = router;
