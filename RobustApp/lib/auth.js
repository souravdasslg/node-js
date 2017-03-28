var Response = require('./response');

module.exports.isAuthenticated = function (req, res, next) {
if (req.isAuthenticated()){
		return next();
	}
	else
	    {
	        var response = Response.generate(true,"Error : Authenication Error",500,null);
	        res.send(response);
        }

};
