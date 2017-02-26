var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var _ = require('lodash');

//this controller is used fot managig the user cart related operation
var auth = require('../../lib/auth');
//shows the cart to user
exports.controller = function(app){
  router.get('/',auth.isAuthenticated,function(req,res) {
    Customer.findOne({'email' : req.session.user.email},function(err,customer){
      if(err)
      {
        res.render('error',{error :err});
      }
      if(customer==""||customer==null||customer==undefined)
      {
        res.render('errorinfo',{info: "Cart Cannot be displayed"})
      }else{
        res.render('cart',{cart : customer.cartInfo})
      }
    })
  })

//add products to the cart
  router.get('/:id',auth.isAuthenticated,function(req,res) {
    Customer.findOne({'email' : req.session.user.email},function(err,customer){
      if(err)
      {
        res.render('error',{error :err});
      }
      if(customer==""||customer==null||customer==undefined)
      {
        res.render('errorinfo',{info: "Cart Cannot be displayed"});
      }
      else
      {
        customer.cartInfo.push(req.params.id);
        customer.save(function(err,customer){
          if(err){res.render('errorinfo',{info : err})}
          else{
            res.render('cart',{cart : customer.cartInfo});
          }
        });
      }
    })
  })

  //delete element from cart
  router.get('/delete/:id',auth.isAuthenticated,function(req,res) {
      Customer.findOne({'email' : req.session.user.email},function(err,customer){
        if(err)
        {
          res.render('error',{error :err});
        }
        if(customer==""||customer==null||customer==undefined)
        {
          res.render('errorinfo',{info: "Cart Cannot be displayed."})
        }else{
          //recreating the cart array for user after removing the specified product
          var cart = _.remove(customer.cartInfo, function(n) {
                 return n != req.params.id;
                });
          customer.cartInfo = cart;
          customer.save(function(err,customer){
            if(err){res.render('errorinfo',{info : err})}
            if(customer==""||customer==null||customer==undefined){
              res.render("errorinfo",{info:"Failed to retrive user data!"})
            }
            else
            {
              res.render('cart',{cart : customer.cartInfo});
            }
          })
        }
      })
    })

  app.use('/cart',router);
}
