module.exports.isAuthenticated = function (req, res, next) {
if (req.isAuthenticated()){
	  if(!req.user.type=='admin' || !req.user.type)
		res.render('errorinfo',{info:"you are now allowed for this link"});
		return next();
	}
   res.redirect('/admin');
}
