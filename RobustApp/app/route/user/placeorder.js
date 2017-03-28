var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var Order = mongoose.model('Order');


var Response = require('../../../lib/response');
//------------------THIS IS NOT IMPLEMENTED -------------------------------------------//
var auth = require('../../../lib/auth');
exports.controller = function(app){
    var response;
  router.post('/create/:productid',auth.isAuthenticated,function(req,res){
    //retrival of the user info
    var customer;
    Customer.findOne({'email' : req.session.user.email},function(err,customer){
      if(err)
      {
        console.log(err);
        response = Response.generate(true,"Error : Database Error",500,null);
        res.send(response);
      }
      else{
        //placing the order
        var newOrder = new Order();
        newOrder.customerId = customer.CustomerId;
        newOrder.productId = req.body.productId;
        newOrder.orderQuantity = req.body.quantity;
        newOrder.orderDate = Date.now();
        newOrder.paymentType= req.body.paytype;
        newOrder.delAddress = req.body.address;

        newOrder.save(function(err,order){
          if(err)
          {
            console.log(err);
            response = Response.generate(true,"Error : Order Cannot be Placed.Database Error",500,null);
          }
          else{
            //writing order id to the user database
            customer.orderHistory.push(order._id);
            customer.save();//write callback


            Products.findOne({'_id' : req.params.productId},function(err,products){
              if(err)
              {
                res.render('error',{error : err});
              }
              else
              {
                //after successful order reduce the stock in product
                products.inStock = products.inStock -1;
                products.save();//write callback
              }
            })

          }
        })
      }
    })

  });



  router.get('/modify',auth.isAuthenticated,function(req,res){

  });
  router.get('/cancel',auth.isAuthenticated,function(req,res){

  });

  app.use('/order',router);
};
