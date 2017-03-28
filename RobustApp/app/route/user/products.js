var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var Products = mongoose.model('Products');
var Customer = mongoose.model('Customer');
var Order    = mongoose.model('Order');
var shortid  = require('shortid');
var _ = require('lodash');

//Import External Libraries
var auth = require('../../../lib/auth');
var Response = require('../../../lib/response');
var Mail = require('../../../lib/mailgun_mailer');

exports.controller = function(app){
    var response;
  //display the product on the URL!
  router.get('/:id',function(req,res){
    Products.findOne({'_id' : req.params.id},function(err,product){
      if(err)
      {
          console.log(err);
          response = Response.generate(true,"Error : Database Error",500,null);
          res.send(response);
      }
      if(product==""||product==null||product==undefined)
      {
          response = Response.generate(true,"Database Error : Failed to Fetch Data",404,null);
          res.send(response);
      }
      else
          {
              response = Response.generate(false,"OK",500,product);
              res.send(response);
          }
    });
  });

 router.get('/create/:id',auth.isAuthenticated,function(req,res){
     Products.findOne({'_id' : req.params.id},function (err,product) {
         if(err)
         {
             console.log(err);
             response = Response.generate(true,"Error : Database Error",500,null);
             res.send(response);
         }
         if(product==""||product==null||product==undefined)
         {
             response = Response.generate(true,"Error : Product Details Error",404,null);
             res.send(response);
         }
         else
         {
             //finding the customer and placing the order
             // preparing the delivery date
             var dt = new Date();
             dt.setDate(dt.getDate()+5);

             if(product.inStock>0)
             {
                 var newOrder = new Order({
                     customerId : req.session.customerId,
                     orderId    : shortid.generate(),
                     productId  : product._id,
                     orderDate : Date.now(),
                     isPaid : false,
                     shippingStatus : false,
                     isActive : true,
                     delAddress : req.session.user.address,
                     deliveryDate : dt
             });

                 //saving the order
                 newOrder.save(function(err,placedOrder){
                     if(err)
                     {
                         console.log(err);
                         response = Response.generate(true,"Error : Could Not Place Order",500,null);
                         res.send(response);
                     }
                     else
                         {   //reducing the stock record of product
                             product.inStock = product.inStock - placedOrder.orderQuantity;
                             product.save(function (err) {
                                 if(err)
                                 {
                                     console.log(err);
                                     response = Response.generate(true,"Error : Could Not Place Order",500,null);
                                     res.send(response);
                                 }
                                 else
                                     {
                                         //saving the order datails in the customer database
                                       Customer.findOne({'email' : req.session.user.email},{password : 0},function(err,customer){
                                           if(err)
                                           {
                                               console.log(err);
                                               response = Response.generate(true,"Error : Could Not Place Order",500,null);
                                               res.send(response);
                                           }
                                           else
                                           {
                                               //removing the element from cart
                                               var cart = _.remove(customer.cartInfo, function(n) {
                                                   return n != product._id;
                                               });
                                               customer.cartInfo = cart;

                                               //placing the order
                                               customer.orderHistory.push(placedOrder.orderId);
                                               customer.save(function(err,newcustomer){
                                                   if(err)
                                                   {
                                                       console.log(err);
                                                       response = Response.generate(true, "Error : Could Not Place Order", 500, null);
                                                       res.send(response);
                                                   }
                                                   else
                                                   {
                                                       //on successful saving the order confirmation mail is sent.
                                                       var mailData = {
                                                           mailTo  : customer.email,
                                                           subject : "Order Has Placed",
                                                           text    :  "Your Order id : "+placedOrder.orderId+"Expected Delivery :"+placedOrder.deliveryDate,
                                                           data    :  ""
                                                       };
                                                       Mail.mail(mailData);
                                                       response = Response.generate(true, "OK", 500, placedOrder);
                                                       res.send(response);
                                                   }
                                               })
                                           }
                                       })
                                     }
                             })
                         }
                 })
             }
         }
     })
 });

 router.get('/cancel/:id',auth.isAuthenticated,function(req,res){
     //finding the order details
    Order.findOne({'orderId' : req.params.id},function (err,orderDetails) {
        console.log(orderDetails);
        if(err)
        {
            console.log(err);
            response = Response.generate(true,"Error: Database Error",500,null);
            res.send(response);
        }
        if(orderDetails==""||orderDetails==null||orderDetails==undefined)
        {
            response = Response.generate(true,"Error: Invalid Order Id",500,null);
            res.send(response);
        }
        else if (orderDetails.isActive)
        {

            //finding the customer to update order data
            Customer.findOne({'email' : req.session.user.email},{password : 0},function (err,customer) {
                if(err)
                {
                    console.log(err);
                    response = Response.generate(true,"Error: Database Error",500,null);
                    res.send(response);
                }
                if(customer==""||customer==null||customer==undefined)
                {
                    response = Response.generate(true,"Error: Database Error",500,null);
                    res.send(response);
                }
                else
                {
                    //Updating the product stock
                    Products.findOne({'_id' : orderDetails.productId},function (err,products) {
                        if(err)
                        {
                            console.log(err);
                            response = Response.generate(true,"Error: Database Error",500,null);
                            res.send(response);
                        }
                        if(products==""||products==null||products==undefined)
                        {
                            response = Response.generate(true,"Error: Could not fetch product",500,null);
                            res.send(response);
                        }
                        else
                        {
                            products.inStock = products.inStock + orderDetails.orderQuantity;
                            products.save(function(err)
                            {
                                if(err)
                                {
                                    console.log(err);
                                    response = Response.generate(true,"Error : Database Error",500,null);
                                    res.send(response);
                                }
                                else
                                {
                                    orderDetails.isActive = false;
                                    orderDetails.save(function(err){
                                        if(err)
                                        {
                                            console.log(err);
                                            response = Response.generate(true,"Error : Database Error",500,null);
                                            res.send(response);
                                        }
                                        else
                                        {
                                            //sending confirmation mail to the customer
                                            var mailData = {
                                                mailTo  : customer.email,
                                                subject : "Order is Cancelled",
                                                text    :  "Your Order id : "+orderDetails.orderId+ " is cancelled",
                                                data    :  ""
                                            };
                                            Mail.mail(mailData);
                                            response = Response.generate(false, "OK", 500, null);
                                            res.send(response);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        else
        {
            response = Response.generate(true,"Error : Order is already Cancelled",200,null);
            res.send(response);
        }
    })
 });

 app.use('/order',router);
};
