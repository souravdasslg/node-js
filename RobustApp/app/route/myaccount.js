var express = require('express');
var router  = express.Router();

var auth = require('../../lib/auth');
exports.controller = function(app){
  router.get('/',auth.isAuthenticated,function(req,res){
    res.send(req.user);
  })
  app.use('/myaccount',router);
}
