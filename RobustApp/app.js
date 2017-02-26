var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    http = require('http');
    morgan = require('morgan'),
    passport = require('passport'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    facebookStrategy = require('passport-facebook').Strategy,
    googleStrategy  = require('passport-google-oauth').OAuth2Strategy,
    LocalStrategy = require('passport-local').Strategy; //delete
    cookieParser = require('cookie-parser'),
    app = express();

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());
var Hash= require('./lib/encrypt-pass');
var Customer = require('./app/model/Customer');
var Admin = require('./app/model/Admin');

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
var accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/access.log'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));
app.use(morgan("dev"));
//passport Configuration
passport.use(new facebookStrategy({
clientID: '364266763958779',
clientSecret: 'ea2b29f0dee3827fdf1ff93009b42d08',
callbackURL: 'http://localhost:3000/login/facebook/return',
profileFields: ['id', 'emails', 'name']
},
function(accessToken, refreshToken, profile, cb) {
   cb(null, profile);
}));
passport.use(new googleStrategy({
  clientID: '983797450356-1itktuj6nmn3adq6pcopcreis56p73th.apps.googleusercontent.com',
  clientSecret: 'kVBVyWDd5HC5iCUGp_uJEjq9',
  callbackURL: 'http://localhost:3000/login/google/return'
},
function(accessToken, refreshToken, profile, cb) {
  cb(null, profile);
}));

passport.use('local',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
   var Hashpass = Hash.makeHash(password);
    Customer.findOne({ 'email' : username }, function (err, user) {
      if (err) { console.log(err);return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.password == Hashpass) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

//admin login
passport.use('admin-login',new LocalStrategy(
  function(username, password, done) {
    Admin.findOne({ 'username' : username }, function (err, user) {
      console.log(user);
      if (err) { console.log(err);return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.password == password) {
        return done(null, false, { message: 'Incorrect password.' });
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
  res.render('error',{error : err});
});

//Creating the server
var server = http.createServer(app);
server.listen(app.get('port'),function(){
  console.log("Server is live" + app.get('port'));
})

exports = module.exports = app;
