var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    http = require('http');
    morgan = require('morgan'),
    passport = require('passport'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    app = express();

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

//Setting up session
app.use(session({
  name :'AppCookie',
  secret: 'ALongSecretKeyForMakingTheCookieSecure'+Date.now(),
  resave: true,
  httpOnly : true,
  saveUninitialized: true,
  cookie: { secure: false }
}));


//Setup the logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, '/etc/access.log'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));
//passport Configuration
require('./config/passport-config')(passport);
//passport initialization
app.use(passport.initialize());
app.use(passport.session());

//define constants
const controllerDir = './app/route/';
const modelDir = './app/model/';

//Include the model files intop the app
fs.readdirSync(modelDir).forEach(function(file){
      if(path.extname(file) == '.js'){
          require(modelDir+file);
        }
});

//Including the controller file to the app
fs.readdirSync(controllerDir).forEach(function(file){
      if(path.extname(file) == '.js'){
          var route = require(controllerDir+file);
          route.controller(app);
        }
})


/* Database Configuration*/
var mongoose = require('mongoose');
var dbpath = "mongodb://localhost/thekart";
mongoose.connect(dbpath);

mongoose.connection.once('open',function(err){
  if(err) {
  console.log(err);
   } else {
  console.log("Database Connection Sucessful");
   }
});


//All environments
app.set('port',process.env.PORT || 3000);
app.set('views', __dirname + '/app/view');
app.set('view engine' ,'ejs');
app.use(express.static(path.join(__dirname+'/public')));

//Error handler
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.redirect('/error');
});

//Creating the server
var server = http.createServer(app);
server.listen(app.get('port'),function(){
  console.log("Server is live" + app.get('port'));
})

exports = module.exports = app;
