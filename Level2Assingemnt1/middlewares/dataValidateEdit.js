var mongoose = require('mongoose');
var shortId = require('shortid');
var response = require('../lib/response');

//Middleware for checking either all values are present or not
exports.dataValidateEdit = function(req,res,next){
  if(req.params.id!=undefined&&req.body.posttitle!=undefined&&req.body.postbody!=undefined&&req.body.author!=undefined){
    next();
  }//if end
else{
  var resmsg = response.generate(true,"Parameter Missing",404,null)
  res.send(resmsg);
 }
}
