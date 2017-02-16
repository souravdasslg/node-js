var express = require('express');
var router  = express.Router();

exports.controller = function(app){
  router.get('/create',function(req,res){

  })
  router.get('/modify',function(req,res){

  })
  router.get('/cancel',function(req,res){

  })

  app.use('/order',router);
}
