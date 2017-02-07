var shortId = require('shortid');
var response = require('../lib/response');
var Blog = require('../app/Model/Blogpost.js');
// function createPost(id,postTitle,postBody,author,createdAt){}

exports.dataValidateCreate = function(req,res,next){
  if(req.body.posttitle!=undefined&&req.body.postbody!=undefined&&req.body.author!=undefined){
    req.body.id   = shortId.generate();
    req.body.createdAt = Date.now();
    next();
}//if end
else{
   var resmsg = response.generate(true,"Error Occured",404,null);
   res.send(resmsg);


}

}
