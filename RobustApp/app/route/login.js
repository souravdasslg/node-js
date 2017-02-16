var express = require('express');
var mongoose = require('mongoose');
var ShortId = require('shortid');
var Customer = mongoose.model('Customer');
var router  = express.Router();

//password encryption library
var Hash = require('./../../lib/encrypt-pass');

exports.controller = function(app){
  router.get('/',function(req,res){
    res.render('login');
  });
  //facebook login
  router.get('/fb',passport.authenticate('facebook',{ scope: ['email']}));


  router.get('/facebook/return',
  passport.authenticate('facebook',{faliureRedirect : '/login'}),
  function(req,res){
    Customer.findOne({'email' : req.user.emails[0].value},function(err,customer){
        if(!customer || customer == "" || customer == undefined){

          var  newCustomer = new Customer({

          customerId     : req.user.id+""+ShortId.generate(),
          customerName   : req.user.name.givenName+" "+req.user.name.familyName,
          email          : req.user.emails[0].value,
          accountCreated : Date.now(),
          provider       : "facebook"
        });
        newCustomer.save(function(err){
              if(err){
                console.log(err);
                res.redirect('/error');
              }
              else{
                req.session.user = req.user;
                res.redirect('/');
              }
            });//end save

        }//end if
      })
    });

  //google login
  router.get('/google',passport.authenticate('google',{ scope : ['profile', 'email'] }));

  router.get('/google/return',
  passport.authenticate('google',{faliureRedirect : '/login'}),function(req,res){
    req.body.encpass = Hash.makeHash(req.body.password);
    Customer.findOne({'email' : req.user.emails[0].value},function(err,customer){
      if(!customer || customer == "" || customer == undefined){
        var  newCustomer = new Customer({
        customerId     : req.user.id+""+ShortId.generate(),
        customerName   : req.user.displayName,
        email          : req.user.emails[0].value,
        accountCreated : Date.now(),
        provider       : "Google"
      });
      newCustomer.save(function(err){
            if(err){
              console.log(err);
              res.redirect('/error');
            }
            else{
              req.session.user = req.user;
              res.redirect('/');
            }
          });//end save
      }//end if
    })
  });


app.use('/login',router);
}
