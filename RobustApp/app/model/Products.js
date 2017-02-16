var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var Products = new Schema({
  productId       : {type:String,required:true},
  productCatagory : {type:String},
  productDesciption : {type:String},
  productPrice    : {type:Number},
  inStock        : {type:Number}
  });
mongoose.model('Products',Products);
