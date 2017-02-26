var express = require('express');
var mongoose = require('mongoose');
var shortId  = require('shortid');
var crypto = require('crypto');
var Customer = mongoose.model('Customer');
var router  = express.Router();

var Hash= require('../../lib/encrypt-pass');

exports.controller = function(app){
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
                  res.render('error',{error:err});
                }
                else{
                  req.session.user = customer;
                  res.render('info',{info : "User Registration Successful!"});
                }
              });//end save
          }//end inner if
          else{
            res.redirect("/signup");
          }
        }//end if
        else{
          res.send('/');
        }

    }
});


router.get('/', function(req, res) {
		res.render('signup.ejs');
	});




  app.use('/signup',router);
}
