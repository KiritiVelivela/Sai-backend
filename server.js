var mongoose = require('mongoose');
    express = require('express');
    cors = require('cors');
    morgan = require('morgan');
    config = require('./config/database');
    passport = require('passport');
    routes = require('./routes/routes');
    bodyParser = require('body-parser');
    nodemailer = require('nodemailer');
    Msg = require('./model/messages');
    // var multer = require('multer');


mongoose.connect(config.database);

mongoose.connection.on('open', function(){
    console.log('Mongo is connected');
    var app = express();
    app.use(morgan('dev'));
    app.use(express.static(__dirname+'/client'));
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    // app.use(function(req, res, next) {
    //   if(req.path === '/') {
    //     res.json({hi: true});
    //   } else {
    //     next();
    //   }
    //   console.log("I am in the middleware");
    // })
    app.use(routes);
    // EJS
    app.set('view engine', 'ejs');
    require('./config/passport')(passport);

    http = require('http').Server(app);
    io = require('socket.io')(http);

    io.on('connection', (socket) => {
      console.log("Inside Socket");
      socket.on('disconnect', function(){
        io.emit('users-changed', {user: socket.nickname, event: 'left'});
      });

      socket.on('add-message', (message) => {
        io.emit('message', {message: message.content, fromemail: message.from, toemail: message.to, created: new Date()});
        console.log(message);
          var newMsg = Msg({
              message: message.content,
              toemail: message.to,
              fromemail: message.from
          });
          console.log(newMsg);

          newMsg.save(function(err, newMsg){
              console.log("Hello addmessage action");
              console.log(newMsg);
              if (err){
                  throw err
              }
                  console.log('echoeing back data =' + message);
                  console.log( message);
                  io.sockets.emit('new message', message);
          });
      });
    });

    http.listen(process.env.PORT || '3333', function(){
        console.log('server is running on 3333');
    })
})
