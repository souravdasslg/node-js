var express = require('express');
var router  = express.Router();

exports.controller = function(app){
  router.get('/',function(req,res){
    req.session.destroy();
    req.logout();
    res.redirect('/');
  })
  app.use('/logout',router);
}
