var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var Products = new Schema({
  productName     : {type:String},
  productCatagory : {type:String,default : ''},
  productDesciption : {type:String,default : ''},
  productPrice    : {type:Number, default: ''},
  productImage   : {type:String,default : ''},
  inStock        : {type:Number,default : ''}
  });
mongoose.model('Products',Products);
