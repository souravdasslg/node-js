var events = require('events');
var express = require('express');
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var router  = express.Router();
var eventEmitter = new events.EventEmitter();

//External Libraries
var Hash = require('./../../../lib/encrypt-pass');
var auth = require('../../../lib/auth');
var Response = require('../../../lib/response');
var mail = require('../../../lib/mailgun_mailer');
var randomString = require('../../../lib/randomStringGenerator');

exports.controller = function(app){
 var response;
/*-------------------------------------------Forgot Password -------------------------------------------*/

  //fetch the required email from body
  router.post('/forgot',function(req,res){
    Customer.findOne({'email' : req.body.email},function(err,customer){
      if(err)
      {
        response = Response.generate(true,"Database Error",500,null);
        res.send(response);
      }
      if(!customer||customer==""||customer==null)
      {
        response = Response.generate(true,"No User Found",400,null);
        res.send(response);
      }
      else
        {
            //we should not pass user data as user is not verified
            //only checks if user is present or not
           var mailData = {
               mailTo  : customer.email,
               subject : "Reset Your Password",
               text    : "Password Reset Link in below",
               html    :  "localhost:3000/password/forgot/verify/"+customer._id+"/"+customer.password
           };
          mail.mail(mailData);
          response = Response.generate(false,"User Found:Password Reset link has been sent to email",200,null);
          res.send(response);
       }
      })
    });


  router.post('/forgot/verify/:customer_id/:password_hash',function(req,res){
    Customer.findOne({'_id' : req.params.customer_id},function(err,customer) {
        if (err)
        {
            console.log(err);
            response = Response.generate(true, "URL Error : Invalid Url", 404, null);
            res.send(response);
        }
        if (!customer || customer == "" || customer == null)
        {
            response = Response.generate(true, " Error : No Data", 404, null);
            res.send(response);
        }
       else
           {
        var custId = customer._id;
        var oldPassHash = customer.password;
        var password = req.body.password;
        var repassword = req.body.repassword;
        if ((oldPassHash == req.params.password_hash) && (custId == req.params.customer_id) && (password == repassword)) {
            customer.password = Hash.makeHash(req.body.password);
            customer.save(function (err, customer) {
                if (err)
                {
                    console.log(err);
                    response = Response.generate(true,"Error : Database Error",500,null);
                    res.send(response);
                }
                else
                    {
                    var mailData = {
                        mailTo  : customer.email,
                        subject : "Password Reset Success",
                        text  :  "Password is reset as per your request.",
                        html  :""
                    };
                    //send a confirmation mail to user
                    mail.mail(mailData);
                    //send response to client
                    response = Response.generate(false,"OK",200,null);
                    res.send(response);
                }
            })
        }
        else
            {
            response = Response.generate(true,"Error : Parameter Error",400,null);
            res.send(response);
            }
        }
    })
  });

/*----------------------------------------Change Password-------------------------------------------------*/



//This route used for changing or creating password
  router.post('/change',auth.isAuthenticated,function(req,res){
    var user = JSON.stringify(req.session.user);
    var userObj = JSON.parse(user);
    Customer.findOne({'email' : userObj.email},function(err,customer){
      if(err){
          console.log(err);
        response = Response.generate(true,"Error :Database Error",500,null);
        res.send(response);
      }
     if(customer==undefined||customer==""||customer==null)
      {
          response = Response.generate(true,"Error :No User",400,null);
          res.send(response);
      }
      //this part of code create password which account doesn't have password
      //those which has been created through social login
       if(customer.password==null || customer.password==undefined ||customer.password== "")
      {
          var newpassword = randomString.generate(10);
        customer.password = Hash.makeHash(newpassword);
        customer.save(function(err){
          if(err)
          {
              response = Response.generate(true,"Error : Database Error",500,null);
              res.send(response);
          }
          else {
              var mailData = {
                  mailTo  : customer.email,
                  subject : "Password Created",
                  text  :  "Your Password is : "+newpassword,
                  html  :""
              };
              //send password to user
              mail.mail(mailData);
              response = Response.generate(false,"OK: Check mail",200,newpassword);
              res.send(response);
          }
        });//end save
      }

    //checks if old password from database and user input does mathces or not
     else if((req.body.password==req.body.repassword)&&req.body.password&&req.body.repassword&&req.body.oldpass)
     {
    if(!req.body.oldpass||(customer.password!=Hash.makeHash(req.body.oldpass)))
       {
           response = Response.generate(true,"Error : Wrong old Password",500,null);
           res.send(response);
       }
       if((customer.password==Hash.makeHash(req.body.oldpass))&&(req.body.password==req.body.repassword))
       {
         customer.password = Hash.makeHash(req.body.password);
         customer.save(function(err){
           if(err)
           {
               console.log(err);
               response = Response.generate(true,"Error : Database Error",500,null);
               res.send(response);
           }
           else
               {
                   var mailData = {
                       mailTo  : customer.email,
                       subject : "Password Changed Successfully",
                       text  :  "Your Password has been changed at "+ Date.now(),
                       html  :""
                   };
                   //send password change notification
                   mail.mail(mailData);
                   response = Response.generate(false,"OK: Check mail",200,customer);
                   res.send(response);
               }
           })
         }
       }
       else
           {
               response = Response.generate(true,"Error : Paramer Error",404,null);
               res.send(response);
           }
    })
  });
app.use('/password',router);
};
