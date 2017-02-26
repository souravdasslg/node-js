var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var Products = mongoose.model('Products');

exports.controller = function(app){
  //display the product on the URL!
  router.get('/:id',function(req,res){
    Products.findOne({'_id' : req.params.id},function(err,product){
      if(err)
      {
        res.render('error',{error :err});
      }
      if(product==""||product==null||product==undefined)
      {
        res.render('error',{error: "No Product is found with this id. Check URL !!"})
      }else{
        res.render('product',{products : product});
      }
    })
  })
 //----feature is not impleted-------//
 router.get('/buy',function(req,res){
   res.render('errorinfo',{info : "Feature is not implemented"})
 })
 router.get('/buy/:id',function(req,res){
   res.render('errorinfo',{info : "Feature is not implemented"})
 })

 app.use('/products',router);
}
