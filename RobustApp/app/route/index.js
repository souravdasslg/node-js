var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
exports.controller = function(app){
  router.get('/',function(req,res){
    res.render('index');
  })

//Testing routes...delete before final submission
  router.get('/find',function(req,res){
    Customer.find({},function(err,customer){
      if(err){
        console.log(err)
      }else{
        res.send(customer);
      }
    })
  })

  router.get('/find/:email',function(req,res){
    Customer.find({'email' : req.params.email},function(err,customer){
      if(err){
        console.log(err)
      }else{
        res.send(customer);
      }
    })
  });

  router.get('/delete/:email',function(req,res){
    Customer.remove({'email' : req.params.email},function(err,customer){
      if(err){
        res.send(err);
        }
        else{
          res.send(customer);
        }

  })
})


  app.use('/',router);
}
