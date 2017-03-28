//Import required modules here
var fs               = require('fs'),
    path             = require('path'),
    express          = require('express'),
    http             = require('http');
    morgan           = require('morgan'),
    passport         = require('passport'),
    session          = require('express-session'),
    bodyparser       = require('body-parser'),
    facebookStrategy = require('passport-facebook').Strategy,
    googleStrategy   = require('passport-google-oauth').OAuth2Strategy,
    LocalStrategy    = require('passport-local').Strategy; //delete
    cookieParser     = require('cookie-parser');
//creating instance of express
var app = express();
//initialise body parser and cookie parser
app.use(bodyparser.json({limit:'10mb',extended:true}));
app.use(bodyparser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

//Importing Libraries
var Hash     = require('./lib/encrypt-pass');
var Customer = require('./app/model/Customer');
var Admin    = require('./app/model/Admin');
var Response = require('./lib/response');

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
var accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));
app.use(morgan("dev"));

//passport Configuration
//**Facebook Authentication Configuration
passport.use(new facebookStrategy({
clientID: 'Insert Facebook Api Key',
clientSecret: 'Insert Key',
callbackURL: 'http://localhost:3000/login/facebook/return',
profileFields: ['id', 'emails', 'name']
},
function(accessToken, refreshToken, profile, cb) {
   cb(null, profile);
}));

//**Google Authentication Configuration
passport.use(new googleStrategy({
  clientID: 'Insert Google app key',
  clientSecret: 'insert google api key',
  callbackURL: 'http://localhost:3000/login/google/return'
},
function(accessToken, refreshToken, profile, cb) {
  cb(null, profile);
}));

//**Local Authentication Configuration
passport.use('local',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
   var Hashpass = Hash.makeHash(password);
    Customer.findOne({ 'email' : username }, function (err, user) {
      if (err) {
          console.log(err);
          return done(err);
      }
      if (!user)
      {
        return done(null, false);
      }
      if (user.password == Hashpass)
      {
        return done(null, false);
      }
      return done(null, user);
    });
  }

  ));

//**Admin Login Authentication Configuration
passport.use('admin-login',new LocalStrategy(
  function(username, password, done) {
    Admin.findOne({ 'username' : username }, function (err, user) {
      console.log(user);
      if (err)
      {
          console.log(err);
          return done(err);
      }
      if (!user)
      {
        return done(null, false);
      }
      if (!user.password == password)
      {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));




passport.serializeUser(function(user, cb) {
cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
cb(null, obj);
});
//passport initialization

app.use(passport.initialize());
app.use(passport.session());
//Passport Configuration Ends Here


//Directory Constants
const adminControllerDir = './app/route/admin/';
const userControllerDir = './app/route/user/';
const modelDir = './app/model/';

//Include the model files into the app
fs.readdirSync(modelDir).forEach(function(file){
      if(path.extname(file) == '.js'){
          require(modelDir+file);
        }
});

//Including the controller file to the app
fs.readdirSync(adminControllerDir).forEach(function(file){
      if(path.extname(file) == '.js'){
          var route = require(adminControllerDir+file);
          route.controller(app);
        }
});
fs.readdirSync(userControllerDir).forEach(function(file){
    if(path.extname(file) == '.js'){
        var route = require(userControllerDir+file);
        route.controller(app);
    }
});

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
//Database Configuration Ends Here

//All environments
app.set('port',process.env.PORT || 3000);


//Error handler
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.send('Error : Logged in Console');
});


//Creating the server
var server = http.createServer(app);
server.listen(app.get('port'),function(){
    console.log("Server is live" + app.get('port'));
});

exports = module.exports = app;
