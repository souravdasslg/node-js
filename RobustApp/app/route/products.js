var express = require('express');
var router  = express.Router();

exports.controller = function(app){
  router.get('/:productId',function(req,res){
    res.render('products');
  })

  app.use('/products',router);
}
