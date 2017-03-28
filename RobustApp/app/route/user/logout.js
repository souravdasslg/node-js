var express = require('express');
var router  = express.Router();

//import external library
var Response = require('../../../lib/response');

exports.controller = function(app){
  router.get('/',function(req,res){
    req.session.destroy();
    req.logout();
    var response = Response.generate(false,"OK",200,null);
    res.send(response);
  });
  app.use('/logout',router);
};
