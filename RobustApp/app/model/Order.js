var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var Order = new Schema({
  customerId     : {type : String ,required : 'true'},
  orderId        : {type : Number ,required : true,default : 000},
  productId      : {type : Number , required :true},
  orderQuantity  : {type : Number},
  orderDate      : {type : Date , default : Date.now()},
  paymentType    : {type : String , required : true},
  orderPrice     : {type : Number , default:0.00},
  isPaid         : {type : Boolean},
  shippingStatus : {type:Boolean},
  delAddress     : {type:String , default :''},
  deliveryDate   : {type : Date}
});

mongoose.model('Order',Order);
