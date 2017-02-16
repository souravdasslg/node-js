var express = require('express');
var router  = express.Router();

exports.controller = function(app){
  router.get('/',  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    console.log(req.user);
    res.render('profile', { user: req.user });
  });

  app.use('/profile',router);
}
