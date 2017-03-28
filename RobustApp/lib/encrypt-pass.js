//Password Hashing Library
var crypto = require('crypto');
module.exports.makeHash = function(password){
  var hash = crypto.createHmac('sha256', password)
                     .update(password)
                     .digest('hex');
      return hash
};
