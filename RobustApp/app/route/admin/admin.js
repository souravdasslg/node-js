var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

var auth     = require('../../../lib/auth-admin');
var Response = require('../../../lib/response');

exports.controller = function(app){
var response;

  router.post('/',passport.authenticate('admin-login'), function(req,res) {
      req.session.user = req.user;
      response = Response.generate(false,"OK",200,null);
      res.send(response);
    });

app.use('/admin',router);
};
