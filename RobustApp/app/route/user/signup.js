var express = require('express');
var mongoose = require('mongoose');
var shortId  = require('shortid');
var crypto   = require('crypto');
var Customer = mongoose.model('Customer');
var router   = express.Router();

//Initialize custom libraries
var Hash     = require('../../../lib/encrypt-pass');
var Response = require('../../../lib/response');
var Mail     = require('../../../lib/mailgun_mailer');

exports.controller = function(app){
    var response;
  router.post('/',function(req,res){
    {
        if((req.body.username!=undefined || req.body.username!="")&&
            (req.body.password!=undefined || req.body.password!="")&&
            (req.body.repassword!=undefined || req.body.repassword!="")){
          if(req.body.password===req.body.repassword){
            var  newCustomer = new Customer({
            customerId     : '1827369903588855'+""+shortId.generate(), //to maintain the similarity between all ids
            customerName   : req.body.username,
            email          : req.body.email,
            password       : Hash.makeHash(req.body.password),
            accountCreated : Date.now(),
            provider       : "Self"
          });
          newCustomer.save(function(err,customer){
                if(err){
                  console.log(err);
                  response = Response.generate(true,"Error : Database Error",500,null);
                  res.send(response);
                }
                else{
                  req.session.user = customer;
                    var mailData = {
                        mailTo  : customer.email,
                        subject : "Welcome,Account Creation Successful",
                        text    :  "Welcome to Yepkart. Hope you'll love us.",
                        data    :  ""
                    };
                    Mail.mail(mailData);
                    delete customer.password;
                  response = Response.generate(false,"OK",200,customer);
                  res.send(response);
                }
              });//end save
          }//end inner if
          else{
            response = Response.generate(true,"Parameter Error : Password Mismatch",400,null);
            res.send(response);
          }
        }//end if
        else{
            response = Response.generate(true,"Parameter Error : Missing Body Parameters",400,null);
            res.send(response);
        }

    }
});
    app.use('/signup',router);
};
