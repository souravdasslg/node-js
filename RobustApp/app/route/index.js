var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var Products = mongoose.model('Products');

exports.controller = function(app){
  router.get('/',function(req,res){
    Products.find({},function(err,products){
      if(err){
        console.log(err)
      }else{
        //res.send(products);
        res.render('index',{product:products});
      }
    })
  })

//---------------------------Uncomment these routes if needed to perform any account Deletion----------/
//-------------------------------------or Seeing raw data-----------------------------//
//Testing routes...can be used for seeing raw data in database
//   router.get('/find',function(req,res){
//     //callback style database operation
//     var customer = function(callback)
//     {
//       var query = Customer.find({});
//       query.exec(function(err,user){
//         if(err){
//         callback(err);
//       }else{
//         callback(err,user);
//       }
//       })
//
//     }
//     //calling function
//     customer(function(err,user){
//       res.send(user);})
// })
//
//   router.get('/find/:email',function(req,res){
//     Customer.find({'email' : req.params.email},function(err,customer){
//       if(err){
//         console.log(err)
//       }else{
//         res.send(customer);
//       }
//     })
//   });
//
//   router.get('/delete/:email',function(req,res){
//     Customer.remove({'email' : req.params.email},function(err,customer){
//       if(err){
//         res.send(err);
//         }
//         else{
//           res.send(customer);
//         }
//
//   })
// })


  app.use('/',router);
}
