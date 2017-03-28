var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var Admin = new Schema({
  username       :{type:String,required:true,unique:true},
  password    : {type:String,default:""},
  type : {type:String,default:"admin"}
});
module.exports = mongoose.model('Admin',Admin);
