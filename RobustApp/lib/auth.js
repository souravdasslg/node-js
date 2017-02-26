module.exports.isAuthenticated = function (req, res, next) {
if (req.isAuthenticated()){
		return next();
	}
   req.session.returnTo = req.path
	 res.redirect('/login');
}
