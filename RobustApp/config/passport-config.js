var shortId = require('shortid');
var facebookStrategy = require('passport-facebook').Strategy;
var googleStrategy  = require('passport-google-oauth').OAuth2Strategy;
var twitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy   = require('passport-local').Strategy;

var Customer = require('../app/model/Customer');

module.exports = function(passport) {

      passport.use(new facebookStrategy({
      clientID: '592437790944797',
      clientSecret: '2d27c1132c02750143c56ec674b8b91e',
      callbackURL: 'http://localhost:3000/login/facebook/return',
      profileFields: ['id', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
    }));
    passport.use(new googleStrategy({
        clientID: '983797450356-1itktuj6nmn3adq6pcopcreis56p73th.apps.googleusercontent.com',
        clientSecret: 'kVBVyWDd5HC5iCUGp_uJEjq9',
        callbackURL: 'http://localhost:3000/login/google/return'
      },
      function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
      }));
      passport.use(new twitterStrategy({
          consumerKey : 'ohp2F476otrVkYwngTS1xh4RC',
          consumerSecret: 'yTBeUSkRiW3lqclQNhkVI9bjznXeZ1fyQHXVCPdF54Rg78PjSF',
          callbackURL: 'http://localhost:3000/login/twitter/return'
        },
        function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
        }));

        //Local Signup
        passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, email, password, done) {
        Customer.findOne({ 'email' :  email }, function(err, customer) {
            if (err)
                return done(err);
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                var newCustomer = new Customer({
                  id    : 112055478745112458+""+shortId.geenerate(),
                  email : req.body.email,
                  password : Hash.makeHash(req.body.password)
                });

                newCustomer.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newCustomer);
                });
              }
            });
          }));


  //passport local login
  passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
              req.body.encpass = Hash.makeHash(req.body.password);
              Customer.findOne({ 'email' :  email }, function(err, customer) {
            if (err)
                return done(err);
            if (!customer)
                return done(null, false,{message : "No account is registered for this email"});
            if (!user.validPassword(req.body.encpass))
                return done(null, false,{message : "Password mismatch"});
            return done(null, customer);
        });
      }));


    passport.serializeUser(function(user, cb) {
      cb(null, user);
    });

      passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
    }
)}
