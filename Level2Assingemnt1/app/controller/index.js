var express = require('express');
var mongoose = require('mongoose');
var BlogPost = mongoose.model('Blog');
var dataValidateCreate = require ('../../middlewares/dataValidateCreate.js');
var dataValidateEdit = require('../../middlewares/dataValidateEdit.js');
var response = require('../../lib/response.js');

var router = express.Router();

module.exports.controller = function(app) {
  router.get('/', function(req,res){
    BlogPost.find(function(err,result){
      if(err){
        var resmsg = response.generate(true,"Internal Server Error",500,null);
        res.send(resmsg);
      }
      else if((result == "") || (result == null)){
        var resmsg = response.generate(false,"No Blog Found",200,null);
        res.send(resmsg);
      }
      else{
        var resmsg = response.generate(false,"Success",200,result);
        res.send(resmsg);
      }
    });//end of find
  });//end of home route


 router.post('/create',dataValidateCreate.dataValidateCreate,function(req,res){
   var newPost = new BlogPost({
       _id           : req.body.id,
       blogTitle     : req.body.posttitle,
       postContent   : req.body.postbody,
       authorName    : req.body.author,
       createdAt     : Date.now(),
   });
       newPost.save(function(err,result){
         if(err){
           var resmsg = response.generate(true,err,404,null);
           res.send(resmsg);
         }//end if
         else{
           var resmsg = response.generate(false,"OK",200,result);
           res.send("Data Saved!");
         }
       });//end save
 });//end of create route

 router.get('/find/:idno',function(req,res){
   BlogPost.findOne({'_id':req.params.idno},function(err,result){
     if(err){
       var resmsg = response.generate(true,err,500,null);
       res.send(resmsg);
     } else if(result == "null" || result == ""){
        var resmsg = response.generate(true,"No data found",404,result);
      }else{
       var resmsg = response.generate(false,"Success",200,result);
       res.send(resmsg);
     }
   })

 });//end of find

 router.post('/edit/:id' , function (req,res) {
   BlogPost.findById({'_id' : req.params.id},function(err,result){
     if(err){
       var resmsg = response.generate(true,err,500,null);
       res.send(resmsg);
     }
     else if((result == null) || (result== ""))
     {
       var resmsg = response.generate(true,"No Data",404,null);
       res.send(resmsg);
     }
     else{
       result.authorName = req.body.author;
       result.blogTitle = req.body.blogtitle;
       result.postContent = req.body.postcontent;
       result.lastModified = Date.now();
       result.save(function(err,newresult){
         if(err){
           res.send(err);
         }else{
           res.send(newresult);
         }
       })
     }
   })
});//end of POST edit route

router.post('/delete/:id', function(req, res){
  BlogPost.remove({'_id' :req.params.id},function(err,result){
    var foundResult = JSON.parse(result);
    if(err){
      var resmsg = response.generate(true,err,500,null);
      res.send(resmsg);
     }
    else if((foundResult.n == 1)&&(foundResult.ok == 1)){
      var resmsg = response.generate(false,"Success",200,result);
      res.send(resmsg);
    }
    else((foundResult.n == 0)&&(foundResult.ok == 1)){
      var resmsg = response.generate(true,"Nothing to delete",404,result);
      res.send(resmsg);
    }
  })
});//end of delete route

 app.use('/blog',router);
}// controller function end
