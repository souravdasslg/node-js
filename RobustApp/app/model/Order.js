var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var Order = new Schema({
  customerId     : {type : String },
  orderId        : {type : String ,default : ''},
  productId      : {type : String },
  orderQuantity  : {type : Number,default : 1},
  orderDate      : {type : Date , default : Date.now()},
  paymentType    : {type : String , default : "COD"},
  orderPrice     : {type : Number , default:0.00},
  isPaid         : {type : Boolean},
  shippingStatus : {type : Boolean},
  isActive       : {type : Boolean},
  delAddress     : {type:String , default :''},
  deliveryDate   : {type : Date}
});

mongoose.model('Order',Order);
