// random password generation library
// used for first time password generation for the users who has logged in from social networking
// In case they want to access the buit-in login instead of social login
module.exports.generate = function(length) {
    var text = "";
    var possible = "ABCD!@#$%EFGHI^JKLMNO&*()_abcdefPQRSTUVWXYZghijkl0123mnopqrst456789uvwxyz";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
