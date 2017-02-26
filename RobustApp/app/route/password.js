var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');

//Externallibrary
var Hash = require('./../../lib/encrypt-pass');
var auth = require('../../lib/auth');

exports.controller = function(app){

/*-------------------------------------------Forgot Password -------------------------------------------*/
  //deliver the required page
  router.get('/forgot',function(req,res){
    res.render('forgotpass');
  })

  //fetch the required email
  router.post('/forgot',function(req,res){
    Customer.findOne({'email' : req.body.email},function(err,customer){
      if(err){
        res.redirect('/error');
      }
      if(!customer||customer==""||customer==null){
        res.render('error',{message : "No user registered with this email"});
      }else{
       res.render('password',{user:customer})
       };
      })
    })


  router.post('/forgot/verify',function(req,res){
    Customer.findOne({'_id' : req.body.userkey},function(err,customer){
      if(err)
      {
        res.redirect('/err',{message : error})
      }
      if(!customer||customer==""||customer==null)
      {
        res.redirect('/error',{message : "No record found"});
      }
      var custId      = customer._id;
      var oldPassHash = customer.password;
      var hashpass    = req.body.passkey;
      var userid      = req.body.userkey;
      var password    = req.body.password;
      var repassword  = req.body.password;
      if((oldPassHash==hashpass)&&(custId==userid)&&(password==repassword))
      {
        customer.password = Hash.makeHash(req.body.password);
        customer.save(function(err,customer){
          if(err)
          {
            res.redirect('/error' ,{message : error});
          }
          else{
            res.redirect('/login');
          }
        })
      }
    })
  })

/*----------------------------------------Change Passwod-------------------------------------------------*/


  router.get('/change',auth.isAuthenticated,function(req,res){
    res.render('changepassword');
  })
//This route used for changing or creating password
  router.post('/change',auth.isAuthenticated,function(req,res){
    var user = JSON.stringify(req.session.user);
    var userObj = JSON.parse(user);
    Customer.findOne({'email' : userObj.email},function(err,customer){
      if(err){
        res.render('error',{error : err});
      }
     if(customer==undefined||customer==""||customer==null)
      {
        res.render('info',{info: "No record found"});
      }
      //this part of code create password which account doesnt have password
      //those which has been created through social login
      else if(customer.password==null || customer.password==undefined ||customer.password== "")
      {
        if(req.body.password==req.body.repassword) {
        customer.password = Hash.makeHash(req.body.password);
        customer.save(function(err){
          if(err)
          {
            res.render('error',{message : err})
          }
          else {
            res.render('info' , {info : "Password Created Successfully for "+customer.email})
          }
        })//end save
      }
      else
      {
        res.render('errorinfo',{info : "Password Doesn't Matches.Try Again"});
      }
    }
    //checks if old password from database and user input does mathces or not
    else if(!req.body.oldpass||(customer.password!=Hash.makeHash(req.body.oldpass)))
       {
           res.render('errorinfo',{info : "Old password doesnt match"});
       }
       if((customer.password==Hash.makeHash(req.body.oldpass))&&(req.body.password==req.body.repassword))
       {
         customer.password = Hash.makeHash(req.body.password);
         customer.save(function(err){
           if(err){res.render('error',{message : err})}
           else{res.render('info',{info : "Password Changed Successfully for "+customer.email})}
           })
         }
       })
     })
app.use('/password',router);
}
