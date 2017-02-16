var express = require('express');
var mongoose = require('mongoose');
var shortId  = require('shortid');
var crypto = require('crypto');
var Customer = mongoose.model('Customer');
var router  = express.Router();

exports.controller = function(app){
  router.post('/',function(req,res){
    {

        if(req.body.username!=undefined&&req.body.username!=undefined&&req.body.password!=undefined&&req.body.repassword!=undefined){
          if(req.body.password===req.body.password){
            var  newCustomer = new Customer({
            customerId     : '1827369903588855'+""+shortId.generate(), //to maintain the similarity between all ids
            customerName   : req.body.username,
            email          : req.body.email,
            password       : hash(req.body.password),
            accountCreated : Date.now(),
            provider       : "Self"
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
          }//end inner if
          else{
            res.send("pass dont matches");
          }
        }//end if
        else{
          res.send("parameter error");
        }

    }
});


  app.use('/signup',router);
}

//password encryption

function hash(string){
var hash = crypto.createHmac('sha256', string)
                   .update(string)
                   .digest('hex');
    return hash
}
