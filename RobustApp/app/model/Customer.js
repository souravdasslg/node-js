const findOrCreate = require('mongoose-find-or-create');
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var Customer = new Schema({
  customerId  :{type:String,required:true,unique:true},
  customerName : {type:String},
  email       :{type:String,required:true,unique:true},
  phoneNumber :{type:String},
  password    : {type:String},
  accountCreated : {type:Date},
  lastLogin     : {type:Date},
  provider      : {type:String},
  cartInfo      :[],
  orderHistory:[]
});
Customer.plugin(findOrCreate);
mongoose.model('Customer',Customer);
