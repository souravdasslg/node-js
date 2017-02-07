var mongoose = require('mongoose');
var shortId = require('shortid');
var response = require('../lib/response');


function editPost(id){
  blogPost.findById({'_id' :id },function(err,post){
    if(err){
      var resmsg = response.generate("error","Post Not Found",404);
      res.send(resmsg);
    }else{
      post.authorName   = req.body.author || post.authorName;
      post.blogTitle    = req.body.posttitle || post.blogTitle;
      post.postContent  = req.body.postcontent || post.postContent;
      post.lastModified = Date.now();
      post.save(function(err){
        if(err){
          var resmsg = response.generate(true,err,404,null);
          res.send(resmsg);
        }//end if
        else{
          next();
        }
      })//end save
    }//end findById else
  })//findById ends here
}//editPost ends here

exports.dataValidateEdit = function(req,res,next){
  if(req.params.id!=undefined&&req.body.posttitl!=undefined&&req.body.postbody!=undefined&&req.body.author!=undefined){
    var id        = req.params.id;
    editPost(id);
    next();
  }//if end
else{
  res.send("Some parameters are missing");
 }
}
