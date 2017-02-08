var mongoose = require('mongoose');
var schema = mongoose.Schema;

var blogPost = new schema({
  _id           : {type : String , unique:true},
  authorName    : {type : String , default:'',required : true},
  blogTitle    : {type : String , default:'',required : true},
  postContent   : {type : String, default:'',required : true},
  createdAt     : {type : Date },
  lastModified  : {type : Date },
  tags          : []

});

mongoose.model('Blog',blogPost);
