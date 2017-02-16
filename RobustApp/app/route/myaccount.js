var express = require('express');
var router  = express.Router();

exports.controller = function(app){
  router.get('/',function(req,res){

  })


  app.use('/myaccount',router);
}
