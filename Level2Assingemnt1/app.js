//loading require module
var express = require('express');
var bodyParser = require ('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var logger = require('morgan');
var path = require('path');
var shortId = require('shortid');

//Creating an instance of express.
var app = express();
app.use(logger("dev"));
//Initializing bodyparser
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
// app.use(cookieParser());

//Connecting Database
var dbPath = "mongodb://localhost/userdata"
var dbConnect = mongoose.connect(dbPath);

//Checking for connection
mongoose.connection.once('open',function (err) {
  console.log("Database Connection Successful");
});

var modelDir ='./app/Model/';
//Include the model files into the app
fs.readdirSync(modelDir).forEach(function(file){
      if(path.extname(file) == '.js'){
          require(modelDir+file);
        }
});
var controllerDir = './app/controller/';
//Including the controller file to the app
fs.readdirSync(controllerDir).forEach(function(file){
      if(path.extname(file) == '.js'){
          var route = require(controllerDir+file);
          route.controller(app);
        }
})
//app configuration
app.set('x-powered-by' , false);
//Setting up the listener port for application
app.set('port', process.env.PORT || 3000);
//listening to port
app.listen(app.get('port'),function(){
  console.log("App is running on port : " + app.get('port'));
});
