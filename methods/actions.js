var User = require('../model/user');
var Msg = require('../model/messages');
var Image = require('../model/images');
var Startups = require('../model/startup');
var config = require('../config/database');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var multer = require('multer');


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
let upload = module.exports = multer({ storage: storage })




var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "skvelivela@gmail.com",
        pass: ""
    }
});
var rand,mailOptions,host,link;

var functions = {
    authenticate: function(req, res) {
        User.findOne({
            email: req.body.email
        }, function(err, user){
            if (err) throw err;

            if(!user) {
                res.status(403).send({success: false, msg: 'Authentication failed, User not found'});
            }

           else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(user, config.secret);
                        res.json({success: true, verified: user.verified, token: token, email: req.body.email});
                    } else {
                        return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
                    }
                })
            }

        })
    },
    addNew: function(req, res){
        if((!req.body.email) || (!req.body.password)){
            console.log(req.body.email);
            console.log(req.body.password);

            res.json({success: false, msg: 'Enter all values'});
        }
        else {
            var newUser = User({
                email: req.body.email,
                password: req.body.password
            });

            newUser.save(function(err, newUser){
                if (err){
                    res.json({success:false, msg:'Failed to save'})
                }

                else {
                    // res.json({success:true, msg:'Successfully saved'});
                    res.json({success:true, msg: 'Message sent'});
                }
            });
            functions.send(req);
        }
    },
    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({success: true, msg: 'hello '+decodedtoken.email});
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },

    getu: function(req, res) {
      User.getUsers(function(err, user) {
        if (err) {
          throw err;
        }
        res.json(user);
      });
    },

    send: function(req,res){
        rand=Math.floor((Math.random() * 100) + 54);
	host='localhost:3333';
	link="http://"+host+"/verify?id="+rand;
	mailOptions={
		to : req.body.email,
		subject : "Please confirm your Email account",
		html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
	}
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error, response){
   	 if(error){
        	console.log(error);
		      throw error;
	 }else{
        	console.log("Message sent: " + response.message);
          functions.sendup(req.body.email, 'Mail Sent!');
		      res.json({success:true, msg: 'Message sent'});
    	 }
});
},

sendup: function(req, res) {
  console.log('sendup:' + req);
  var email = req;
User.findOne({email: email}, function(err, foundObject) {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      if(!foundObject){
        res.status(404).send();
      }
     else {
      if(foundObject.verified == 'mail not sent') {
        foundObject.verified = 'Mail Sent';
      } else if (foundObject.verified == 'Mail Sent') {
        foundObject.verified = 'verified';
      }
      foundObject.save(function(err, updateObject) {
        if(err) {
          console.log(err);
          res.status(500).send();
        } else {
          console.log(updateObject);
        }
      });
    }
    }
  });
},

verify: function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
	console.log("Domain is matched. Information is from Authentic email");
	if(req.query.id==rand)
	{
		console.log("email is verified");
		res.end("Email "+mailOptions.to+" has been Successfully verified. Please Login.");
    functions.sendup(mailOptions.to);
	}
	else
	{
		console.log("email is not verified");
		res.end("<h1>Bad Request</h1>");
	}
}
else
{
	res.end("<h1>Request is from unknown source</h1>");
  console.log("email is not verified");
}
},

// addmessage: function(req, res) {
//   console.log(req.body);
//   var newMsg = Msg({
//       message: req.body.content,
//       toemail: req.body.to,
//       fromemail: req.body.from
//   });
//   console.log(newMsg);
//
//   newMsg.save(function(err, newMsg){
//       console.log("Hello addmessage action");
//       console.log(newMsg);
//       if (err){
//           res.json({success:false, msg:'Failed to save'})
//       }
//
//       else {
//           res.json({success:true, msg:'Successfully saved'});
//           // res.json({success:true, msg: 'Message sent'});
//       }
//   });
// },

getmsgs: function(req,res) {
  console.log("get messages action");
  console.log(req.body.to);
  Msg.find({to: req.body.to, from: req.body.from}, function(err, data) {
    if (err) {
      res.json({success: false, msg: err});
    } else
    console.log(data);
    res.json({history: data});
  });
},


////////////////  ADD STARTUPS //////////////
addStartup: function(req, res){
  console.log("inside addStartup");
  console.log(req.body);
  console.log(req);
    if((!req.body.startupname) || (!req.body.startupvision) || (!req.body.startupmission) || (!req.body.startupproblem) || (!req.body.startupsolution) || (!req.body.startupdescription)|| (!req.body.startupurl)){
        console.log(req.body);
        console.log(req.files[0].filename, 'files');
        console.log("inside addStartup action.js");
        console.log(req.body);
        // console.log(req.body.password);
        res.json({success: false, msg: 'Enter all values'});
    }
    else {
        console.log(req.body);
        console.log();
        var newStartup = Startups({
            startupname: req.body.startupname,
            startupvision: req.body.startupvision,
            startupmission: req.body.startupmission,
            startupproblem: req.body.startupproblem,
            startupsolution: req.body.startupsolution,
            startupdescription: req.body.startupdescription,
            startupurl: req.body.startupurl,
            filename: req.files.filename,
            originalName: req.files.originalname,
            path: req.files.path
        });

        newStartup.save(function(err, newStartup){
            if (err){
                res.json({success:false, msg:'Failed to save'})
            }

            else {
                // res.json({success:true, msg:'Successfully saved'});
                res.json({success:true, msg: 'Startup Sucessfully created'});
            }
        });
        functions.send(req);
    }
},

getStartups: function(req, res) {
  console.log("reached actions.getStartups");
  Startups.getStartups(function(err, startups) {
    if (err) {
      throw err;
    }
    console.log(startups);
    res.json(startups);
  });
},

// Delete one image by its ID
delStartups: function(req, res, next) {
    console.log("Inside Delete before assigning id");
    let startupId = req.params.id;
    console.log("INside Delete");

    console.log(startupId);


    Startups.findByIdAndRemove(startupId, (err, startups) => {
        if (err && startups) {
          console.log("Error in Delete");
          res.sendStatus(400);
        }
          console.log("Delete Successfull");
          res.json({success:true, msg: 'Startup Sucessfully Deleted', id: startups});
    });
},

///////////////////// IMAGE UPLOAD CODE ///////////////////////

// Init app
// const app = express();

// // EJS
// app.set('view engine', 'ejs');

// Public Folder
// app.use(express.static('./public'));
//
// app.get('/', (req, res) => res.render('index'));

getAllImg: function(req, res, next){
  Image.find({}, '-__v').lean().exec((err, images) => {
    if (err) {
      console.log(err);
        res.sendStatus(400);
    }

    // Manually set the correct URL to each image
    for (let i = 0; i < images.length; i++) {
        var img = images[i];
        img.url = req.protocol + '://' + req.get('host') + '/uploads/' + img.filename;
        console.log(img.url);
    }
    console.log(images);
    res.json(images);
  })
},


addImage: function(req, res, next) {
  console.log(req.body, 'Body');
  console.log(req.files[0].filename, 'files');
  console.log("Inside addImage");
  var newImage = Image({
      filename: req.files[0].filename,
      originalName: req.files[0].originalname,
      path: req.files[0].path
  });

  newImage.save(function(err, newImage){
      if (err){
        console.log(err);
        console.log("Failed to save");
          res.json({success:false, msg:'Failed to save'})
      }

      else {
          // res.json({success:true, msg:'Successfully saved'});
          console.log("Image Sucessfully uploaded");
          res.json({success:true, msg: 'Image Sucessfully uploaded'});
      }
  });
},

getOneImg: function(req, res, next) {
  console.log(req.params);
    let imgId = req.params.id;

    Image.findById(imgId, (err, image) => {
        if (err) {
            res.sendStatus(400);
        }
        // stream the image back by loading the file
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
    });
}

}

module.exports = functions;
