var express = require('express');
var shortid = require('shortid');
var router  = express.Router();
var mongoose = require('mongoose');
var Products = mongoose.model('Products');

//admin authorization library
var auth = require('../../lib/auth-admin');

exports.controller = function(app){
  router.get('/get',auth.isAuthenticated,function(req,res){
    Products.find({},function(err,products){
      if(err){
        console.log(err)
      }else{
        res.render('listProduct',{products : products});
      }
    })
  });

  router.get('/edit/:id',auth.isAuthenticated,function(req,res){
    Products.findOne({'_id' : req.params.id},function(err,products){
      if(err){res.render('errorinfo',{info:err});}
      if(products==null || products == "" || products == undefined){
      res.render('info' ,{info: "No product is present in this id or check the url"});
    }
    else{res.render('productRegistrationEdit',{products : products});}
  })
})

  router.post('/edit',auth.isAuthenticated,function(req,res){
    Products.findOne({'_id' : req.body.id},function(err,products){
        if(err){
          console.log(err);
        }

       if(products==null || products == "" || products == undefined){
        res.render('info' ,{info: "No product is present in this id or check the url"});
      }else{
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
           res.render('error',{error :err});
         }
         else{
           res.render('info' ,{info:"Product Updation Successful"}) //replace with product page in final submission
         }
       });//end save
     }
   })//end findone
 });

 router.get('/delete/:id',auth.isAuthenticated,function(req,res){
   Products.remove({'_id' : req.params.id},function(err,products){
     var foundResult = JSON.parse(products);
     if(err){
       res.render('error',{error:err});
      }
      //Based upon the result that is return by mongoose this condition checks for internal functionality
     else if((foundResult.n == 1)&&(foundResult.ok == 1)){
       res.render('info',{info:"Deletion Successful"});
     }
     else{
       res.render('info',{info:"Nothing to delete"});
     }
   })
 });//end of delete route

    router.get('/create',auth.isAuthenticated,function(req,res){
    res.render('productRegistration',{products : false});
  })

  router.post('/create',auth.isAuthenticated,function(req,res){
    var newProducts = new Products({
      productName       : req.body.name,
      productCatagory   : req.body.catagory,
      productDesciption : req.body.description,
      productImage      : req.body.imagelink,
      inStock           : req.body.stock,
      productPrice      : req.body.price
    });

    newProducts.save(function(err){
          if(err){
            console.log(err);
            res.render('error',{message : err});
          }
          else{
            res.render ('info',{info : "Product Registration Successful"});
          }
        });//end save
      })

  app.use('/admin/products',router);
}
