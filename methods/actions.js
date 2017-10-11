var User = require('../model/user');
var Msg = require('../model/messages');
var config = require('../config/database');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');


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
                        res.json({success: true, token: token, email: req.body.email});
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

addmessage: function(req, res) {
  console.log(req.body);
  var newMsg = Msg({
      message: req.body.content,
      toemail: req.body.to,
      fromemail: req.body.from
  });
  console.log(newMsg);

  newMsg.save(function(err, newMsg){
      console.log("Hello addmessage action");
      console.log(newMsg);
      if (err){
          res.json({success:false, msg:'Failed to save'})
      }

      else {
          res.json({success:true, msg:'Successfully saved'});
          // res.json({success:true, msg: 'Message sent'});
      }
  });
},

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
}




}

module.exports = functions;
