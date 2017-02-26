var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');

var auth = require('../../lib/auth');
exports.controller = function(app){
 //Show  User Profile
  router.get('/',auth.isAuthenticated,function(req, res){
    //load the profile with updated data
    Customer.findOne({'email' : req.session.user.email},function(err,customer){
      if(err){res.render('errorinfo',{info : err})}
      if(!customer || customer == "" || customer == undefined)
      {
        res.render('errorinfo',{info : "Could not retrive user data!"})
      }
      else
      {
        res.render('profile',{user : customer})
      }
    })
  });

//Render Edit Profile page with existing user data
router.get('/edit',auth.isAuthenticated,function(req, res){
  //fetches updated info
  Customer.findOne({'email' : req.session.user.email},function(err,customer){
    if(err){res.render('errorinfo',{info : err})}
    if(!customer || customer == "" || customer == undefined)
    {res.render('errorinfo',{info : "Could not retrive user data!"})}
    else{res.render('edit-profile',{user : customer})}
  })
});

//Edit Existing User Details
router.post('/edit',auth.isAuthenticated,function(req,res){
  Customer.findOne({'_id' : req.body.id},function(err,customer){
    if(err)
    {
      console.log(err);
      res.render('errorinfo',{error : err});
    }
     if(!customer || customer == "" || customer == undefined){
       res.render('errorinfo',{info : "No User Found"});
     }
     else
     {

       customer.customerName = req.body.name    || customer.customerName;
       customer.phoneNumber  = req.body.phone   || customer.phoneNumber;
       customer.address      = req.body.address || customer.address;
       customer.save(function(err){
           if(err)
           {
             console.log(err);
             res.render('errorinfo',{info : err});
           }
           else
           {
           res.render('info',{info : "User Data Updated!"})
           }
         });//end save
       } //end else
     })
   })



  app.use('/profile',router);
}
