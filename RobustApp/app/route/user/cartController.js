var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var Products = mongoose.model('Products');
var _ = require('lodash');

//this controller is used fot managing the user cart related operation
var auth     = require('../../../lib/auth');
var Response = require('../../../lib/response');

//shows the cart to user
exports.controller = function(app)
{
  var response;
  router.get('/',auth.isAuthenticated,function(req,res){
    Customer.findOne({'email' : req.session.user.email},function(err,customer){
      if(err)
      {
          console.log(err);
          response = Response.generate(true,"Error : Database Error",500,null);
          res.send(response);
      }
      if(customer==""||customer==null||customer==undefined)
      {
          response = Response.generate(true,"Error : No Cart Info",400,null);
          res.send(response);
      }
      else if(customer.cartInfo.length==0)
        {
            response = Response.generate(false,"No item in cart",200,null);
            res.send(response);
        }
        else
          {
              response = Response.generate(false,"OK",200,customer.cartInfo);
              res.send(response);
          }
    })
  });

//add products to the cart
  router.get('/:id',auth.isAuthenticated,function(req,res) {
    Customer.findOne({'email' : req.session.user.email},function(err,customer){
      if(err)
      {
          console.log(err);
          response = Response.generate(true,"Error : Database Error",500,null);
          res.send(response);
      }
      if(customer==""||customer==null||customer==undefined)
      {
          response = Response.generate(true,"Error : User Error ",404,null);
          res.send(response);
      }
      else
      {
        customer.cartInfo.push(req.params.id);
        customer.save(function(err,customer){
          if(err){
            console.log(err);
            response = Response.generate(true,"Error : Database Error",500,null);
            res.send(response);
          }
          else
            {
                response = Response.generate(false,"OK",200,customer.cartInfo);
                res.send(response);
            }
        });
      }
    })
  });

  //delete element from cart
  router.get('/delete/:id',auth.isAuthenticated,function(req,res) {
      Customer.findOne({'email' : req.session.user.email},function(err,customer){
        if(err)
        {
            console.log(err);
            response = Response.generate(true,"Error : Database Error",500,null);
            res.send(response);
        }
        if(customer==""||customer==null||customer==undefined)
        {
            response = Response.generate(true,"Error : No Data Found",400,null);
            res.send(response);
        }else{
          //recreating the cart array for user after removing the specified product
          var cart = _.remove(customer.cartInfo, function(n) {
                 return n != req.params.id;
                });
          customer.cartInfo = cart;
          customer.save(function(err,customer){
            if(err)
            {
                response = Response.generate(true,"Error : Database Error",500,null);
                res.send(response);
            }
            if(customer==""||customer==null||customer==undefined)
            {
                response = Response.generate(true,"Error : No User Data",500,null);
                res.send(response);
            }
            else
            {
                response = Response.generate(true,"OK",200,customer.cartInfo);
                res.send(response);
            }
          })
        }
      })
  });

  app.use('/cart',router);
};
