module.exports.makeHash = function(password){
  var hash = crypto.createHmac('sha256', password)
                     .update(string)
                     .digest('hex');
      return hash
}
