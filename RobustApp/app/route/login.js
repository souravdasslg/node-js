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

  //facebook login validation
  router.get('/facebook/return',
  passport.authenticate('facebook',{faliureRedirect : '/login'}),
  function(req,res){
    Customer.findOne({'email' : req.user.emails[0].value},function(err,customer){
        if(err){
          console.log(err);
        }
         if(!customer || customer == "" || customer == undefined){
           var  newCustomer = new Customer({
             customerId     : req.user.id,
             customerName   : req.user.name.givenName+" "+req.user.name.familyName,
             email          : req.user.emails[0].value,
             accountCreated : Date.now(),
             provider       : "facebook"
        });
        newCustomer.save(function(err,customer){
              if(err){res.render('errorinfo',{info : err});}
              else{req.session.user = customer;}
            });//end save
          }else{
          //save last login time
          customer.lastLogin = Date.now();
          customer.save(function(err,customer){
            if(err){console.log(err)}
            else{req.session.user = customer;}
          });
        }
        req.session.user = customer;
        res.redirect('/profile');
      })
    });

  //google login
  router.get('/google',passport.authenticate('google',{ scope : ['profile', 'email'] }));

  router.get('/google/return',passport.authenticate('google',{faliureRedirect : '/login'}),function(req,res){
    Customer.findOne({'email' : req.user.emails[0].value},function(err,customer){
      if(!customer || customer == "" || customer == undefined){
        var  newCustomer = new Customer({
        customerId     : req.user.id,
        customerName   : req.user.displayName,
        email          : req.user.emails[0].value,
        accountCreated : Date.now(),
        provider       : "Google"
      });
      newCustomer.save(function(err,customer){
        if(err){
          console.log(err);
          res.render('error',{error :err});
        }else{
          customer.lastLogin = Date.now();
          customer.save(function(err,customer){
            if(err){console.log(err)}
            else{req.session.user = customer;}
        })
        }
      })//end save
    }//end if
    else{
        customer.lastLogin = Date.now();
        customer.save(function(err,customer){
          if(err){console.log(err)}
          else{
            req.session.user = customer;
            res.redirect('/profile');
          }
        })
      }//end else
    })
  })


//built-in login

router.post('/auth',passport.authenticate('local',{failureRedirect: '/login' }),function(req,res) {
    Customer.findOne({'email' : req.user.email},function(err,customer){
      if(err){res.render('errorinfo',{info : err})};
      if(!customer || customer == "" || customer == undefined){
        res.render('errorinfo',{info : "Could Not Retrive User Data"});
      }else{
        //save last login time
        customer.lastLogin = Date.now();
        customer.save(function(err,customer){
          if(err){console.log(err)}
          else{
            req.session.user = customer;
            res.redirect('/profile');
          }
        })
      }
    })
  })




app.use('/login',router);
}
