var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');

//Importing Libraries
var auth = require('../../../lib/auth');
var Response = require('../../../lib/response');
exports.controller = function(app){
 //Show  User Profile
    var response;
  router.get('/',auth.isAuthenticated,function(req, res){
    //load the profile with updated data
    Customer.findOne({'email' : req.session.user.email},function(err,customer){
      if(err)
      {
          console.log(err);
          response = Response.generate(true,"Error : Database Error",500,null);
          res.send(response);
      }
      if(!customer || customer == "" || customer == undefined)
      {
          console.log(err);
          response = Response.generate(true,"Error : Failed to Fetch Data",404,null);
          res.send(response);
      }
      else
      {
          console.log(err);
          response = Response.generate(false,"OK",200,customer);
          res.send(response);
      }
    })
  });


//Edit Existing User Details
router.post('/edit',auth.isAuthenticated,function(req,res){
  Customer.findOne({'_id' : req.body.id},function(err,customer){
    if(err)
    {
        console.log(err);
        response = Response.generate(true,"Error : Database Error",500,null);
        res.send(response);
    }
     if(!customer || customer == "" || customer == undefined){
         console.log(err);
         response = Response.generate(true,"Error : Failed to Fetch Data",404,null);
         res.send(response);
     }
     else
     {

       customer.customerName = req.body.name    || customer.customerName;
       customer.phoneNumber  = req.body.phone   || customer.phoneNumber;
       customer.address      = req.body.address || customer.address;
       customer.save(function(err,updatedCustomerData){
           if(err)
           {
             console.log(err);
             res.render('errorinfo',{info : err});
           }
           else
           {
               console.log(err);
               response = Response.generate(false,"OK",200,updatedCustomerData);
               res.send(response);
           }
         });//end save
       } //end else
     });
   });



  app.use('/profile',router);
};
