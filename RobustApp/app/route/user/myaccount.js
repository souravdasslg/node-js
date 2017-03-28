var express = require('express');
var mongoose = require('mongoose');
var router  = express.Router();


//Import Customer Model
var Customer = mongoose.model('Customer');

//Importing Custom Library
var Response = require('../../../lib/response');
var auth = require('../../../lib/auth');

exports.controller = function(app){
    var response;
  router.get('/',auth.isAuthenticated,function(req,res){
      Customer.findOne({'email' : req.session.user.email},{password : 0},function (err,customer){
         if(err)
         {
             console.log(err);
             response = Response.generate(true,"Error : Database Error",500,null);
             res.send(response);
         }
         if(!customer || customer == "" || customer == undefined)
          {
              response = Response.generate(true,"Error : No User Record",404,null);
              res.send(response);
          }
          else
         {
             response = Response.generate(true,"OK",200,customer);
             res.send(response);
         }
      });
  });
  app.use('/myaccount',router);
};
