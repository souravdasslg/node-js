var express = require('express');
var shortid = require('shortid');
var router  = express.Router();
var mongoose = require('mongoose');
var Products = mongoose.model('Products');

//admin authorization library
var auth = require('../../../lib/auth-admin');
var Response = require('../../../lib/response');

exports.controller = function(app){
    var response;
  router.get('/get',function(req,res){
    Products.find({},function(err,products){
      if(err)
      {
          console.log(err);
          response = Response.generate(true, "Error :Database Error", 500, null);
          res.send(response);
      }
      else
          {
          response = Response.generate(false, "OK", 200, products);
          res.send(response);
          }
    })
  });

  router.get('/edit/:id',auth.isAuthenticated,function(req,res){
    Products.findOne({'_id' : req.params.id},function(err,products){
      if(err)
      {
          console.log(err);
          response = Response.generate(true, "Error :Database Error", 500, null);
          res.send(response);
      }
      if(products==null || products == "" || products == undefined)
      {
          response = Response.generate(true, "Error :No Products", 404, null);
          res.send(response);
      }
      else
          {
              response = Response.generate(false, "OK", 200, products);
              res.send(response);
          }
  })
})

  router.post('/edit',auth.isAuthenticated,function(req,res){
    Products.findOne({'_id' : req.body.id},function(err,products){
        if(err)
        {
            console.log(err);
            response = Response.generate(true, "Error :Database Error", 500, null);
            res.send(response);
        }

       if(products==null || products == "" || products == undefined)
       {
           response = Response.generate(true, "Error :No Products", 404, null);
           res.send(response);
       }
       else
           {
               products.productName       = req.body.name;
               products.productCatagory   = req.body.catagory;
               products.productDesciption = req.body.description;
               products.productImage      = req.body.imagelink;
               products.inStock           = req.body.stock;
               products.productPrice      = req.body.price;
               products.save(function(err,updatedPoduct)
               {
                   if(err)
                   {
                       console.log(err);
                       response = Response.generate(true, "Error :Database Error", 500, null);
                       res.send(response);
                   }
                   else
                       {
                           console.log(err);
                           response = Response.generate(false, "OK", 200, updatedPoduct);
                           res.send(response);
                       }
               });//end save
           }
    })//end findone
 });

 router.get('/delete/:id',auth.isAuthenticated,function(req,res){
   Products.remove({'_id' : req.params.id},function(err,products){
     var foundResult = JSON.parse(products);
     if(err){
         console.log(err);
         response = Response.generate(true, "Error :Database Error", 500, null);
         res.send(response);
      }
      //Based upon the result that is return by mongoose this condition checks for internal functionality
     else if((foundResult.n == 1)&&(foundResult.ok == 1)){
         response = Response.generate(false, "OK", 500, null);
         res.send(response);
     }
     else
         {
         response = Response.generate(true, "Error : Nothing to delete", 500, null);
         res.send(response);
         }
   })
 });//end of delete route


  router.post('/create',auth.isAuthenticated,function(req,res){
    var newProducts = new Products({
      productName       : req.body.name,
      productCatagory   : req.body.catagory,
      productDesciption : req.body.description,
      productImage      : req.body.imagelink,
      inStock           : req.body.stock,
      productPrice      : req.body.price
    });

    newProducts.save(function(err,savedProduct){
          if(err){
              console.log(err);
              response = Response.generate(true, "Error :Database Error", 500, null);
              res.send(response);
          }
          else
              {
              response = Response.generate(false, "OK", 200, savedProduct);
              res.send(response);
              }
    });//end save
  });

  app.use('/admin/products',router);
};
