var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var Hash = require('../../lib/encrypt-pass');
var Customer = new Schema({
  customerId  :{type:String,unique:true},
  customerName : {type:String,default:""},
  email       :{type:String,unique:true},
  phoneNumber :{type:String,default:""},
  password    : {type:String,default:""},
  accountCreated : {type:Date,default:Date.now()},
  lastLogin     : {type:Date,default:""},
  address       : {type:String,default:""},
  type          :{type:String,default:"user"},
  provider      : {type:String,default : ""},
  cartInfo      :[{type:String,default : ""}],
  orderHistory:[{type:String,default : ""}]
});
module.exports = mongoose.model('Customer',Customer);
