var Response = require('./response');

module.exports.isAuthenticated = function (req, res, next) {
    var response;
    if (req.isAuthenticated()) {
        if (!req.user.type == 'admin' || !req.user.type) {
            response = Response.generate(true, "Error :Access Denied", 200, null);
            res.send(response);
        }
        else
            {
                next();
            }
    }
    else
        {
            response = Response.generate(true, "Error :Access Denied", 200, null);
            res.send(response);
        }
};
