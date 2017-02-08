var express = require('express');
var mongoose = require('mongoose');
var BlogPost = mongoose.model('Blog');
//middlewares
var dataValidateCreate = require ('../../middlewares/dataValidateCreate.js');
var dataValidateEdit = require('../../middlewares/dataValidateEdit.js');
//library
var response = require('../../lib/response.js');
//instance of router
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

//create route
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
           res.send(resmsg);
         }
       });//end save
 });//end of create route

//find route
 router.get('/find/:id',function(req,res){
   BlogPost.findOne({'_id':req.params.id},function(err,result){
     if(err){
       var resmsg = response.generate(true,err,500,null);
       res.send(resmsg);
     }else if(result == "null" || result == "" || result == undefined){
        var resmsg = response.generate(true,"No data found",404,result);
        res.send(resmsg);
      }else{
       var resmsg = response.generate(false,"Success",200,result);
       res.send(resmsg);
     }
   })

 });//end of find

//edit route
 router.post('/edit/:id',dataValidateEdit.dataValidateEdit,function (req,res) {
   BlogPost.findById({'_id' : req.params.id},function(err,result){
     if(err){
       var resmsg = response.generate(true,err,500,null);
       res.send(resmsg);
     }
     //If "id" parameter doesnot match or any other erroe when empty result is retured, to handle that error
     else if(result == null || result== "" || result == undefined)
     {
       var resmsg = response.generate(true,"No Data",404,null);
       res.send(resmsg);
     }
     else{
       // If any user send empty value, this code will prevent error
       //This code will update over existing data
       result.postContent = req.body.postbody || result.postContent;
       result.blogTitle = req.body.posttitle || result.blogTitle;
       result.authorName = req.body.author || result.authorName;
       result.lastModified = Date.now();
       result.save(function(err,newresult){
         if(err){
           var resmsg = response.generate(true,err,500,null);
           res.send(resmsg);
         }else{
           var resmsg = response.generate(false,"Success",200,newresult)
           res.send(resmsg);
         }
       })
     }
   })
});//end of POST edit route

router.post('/delete/:id', function(req, res){
  BlogPost.remove({'_id' :req.params.id},function(err,result){
    //result is converted to javascript object so that internal values can be accessed.
    var foundResult = JSON.parse(result);
    if(err){
      var resmsg = response.generate(true,err,500,null);
      res.send(resmsg);
     }
     //Based upon the result that is return by mongoose this condition checks for internal functionality
    else if((foundResult.n == 1)&&(foundResult.ok == 1)){
      var resmsg = response.generate(false,"Success",200,result);
      res.send(resmsg);
    }
    else{
      var resmsg = response.generate(true,"Nothing to delete",404,result);
      res.send(resmsg);
    }
  })
});//end of delete route

 app.use('/blog',router);
}// controller function end
