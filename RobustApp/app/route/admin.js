var express = require('express');
var mongoose = require('mongoose');
var router  = express.Router();
exports.controller = function(app){

//admin authorization library
var auth = require('../../lib/auth-admin');
router.get('/',function(req,res) {
  res.render('admin-login');
  });

  router.get('/profile',auth.isAuthenticated,function(req,res) {
    res.render('adminProfile');
    });

  router.post('/',passport.authenticate('admin-login',{failureRedirect: '/admin' }),
       function(req,res) {
      req.session.user = req.user;
      res.redirect('admin/profile');
    });

app.use('/admin',router);
}
