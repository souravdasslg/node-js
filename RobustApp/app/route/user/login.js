//initialize the required libraries
var express  = require('express');
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');
var router   = express.Router();


var Response = require('../../../lib/response');

//define routes
exports.controller = function(app){
  router.get('/',function(req,res){
    res.render('login');
  });
  //facebook login
  router.get('/fb',passport.authenticate('facebook',{ scope: ['email']}));

  //facebook login validation
  router.get('/facebook/return',
  passport.authenticate('facebook'),
  function(req,res){
      var response;
      //takes the data from the facebook api and search it in local database
      //{password : 0} omits the password field while retriving data from customer model
    Customer.findOne({'email' : req.user.emails[0].value},{password : 0},function(err,customer){
        //checks for database error
        if(err)
        {
          console.log(err);
          var response = Response.generate(true,"Error : Database Error",500,null);
          res.send(response);
        }
        //checks if database sends some unexpected results or blank result
        //depends upon that new customer record is created
         if(!customer || customer == "" || customer == undefined)
         {
           var  newCustomer = new Customer({
             customerId     : req.user.id,
             customerName   : req.user.name.givenName+" "+req.user.name.familyName,
             email          : req.user.emails[0].value,
             accountCreated : Date.now(),
             provider       : "facebook"
        });
        newCustomer.save(function(err,customer)
        {
              if(err)
              {
                  console.log(err);
                  response = Response.generate(true,err,500,null);
                  res.JSON(response);
              }
              else
                  {
                      //send the entire user object to API Consumer
                      req.session.user = customer;
                      response = Response.generate(false,"OK",200,customer);
                      res.JSON(response);
                  }
            });//end save
          }else
              {
             // if customer is already present
          //save last login time
          customer.lastLogin = Date.now();
          customer.save(function(err,customer){
            if(err)
            {
                console.log(err);
                response = Response.generate(true,err,500,null);
                res.send(response);
            }
            else
                {
                    req.session.user = customer;
                    response = Response.generate(false,"OK",200,customer);
                    res.send(response);
                }
          });
        }
      })
    });

  //google login
  router.get('/google',passport.authenticate('google',{ scope : ['profile', 'email'] }));

  router.get('/google/return',passport.authenticate('google'),function(req,res){
      var response;
    Customer.findOne({'email' : req.user.emails[0].value},{password : 0},function(err,customer){
        if(err)
        {
            console.log(err);
            response = Response.generate(true,"Database Error : Failed to Fetch Data",500,null);
            res.send(response);
        }
      if(!customer || customer == "" || customer == undefined)
      {
        var  newCustomer = new Customer({
        customerId     : req.user.id,
        customerName   : req.user.displayName,
        email          : req.user.emails[0].value,
        accountCreated : Date.now(),
        provider       : "Google"
      });
      newCustomer.save(function(err,customer){
        if(err)
        {
          console.log(err);
             response = Response.generate(true,"Database Error : Failed to Save Data",500,null);
            res.send(response);
        }else{


            //save last login time for first time login
          customer.lastLogin = Date.now();
          customer.save(function(err,customer)
          {
            if(err)
            {
                console.log(err);
                 response = Response.generate(true,"Database Error : Error in Saving Login Time",500,null);
                res.send(response);

            }
            else
                {
                    req.session.user = customer;
                    response = Response.generate(false,"OK",200,customer);
                    res.send(response);
                }
        })
        }
      })//end save
    }//end if
    else{
        customer.lastLogin = Date.now();
        customer.save(function(err,customer)
        {
          if(err)
          {
              console.log(err);
              response = Response.generate(true,"Database Error : Failed to save login time",500,null);
          }
          else{
              req.session.user = customer;
              response = Response.generate(false,"OK",200,customer);
              res.send(response);

          }
        })
      }//end else
    });
  });


//built-in login

router.post('/auth',passport.authenticate('local'),function(req,res) {
    console.log(req.user);
    var response;
    Customer.findOne({'email' : req.user.email},{password : 0},function(err,customer){
      if(err)
      {
          console.log(err);
          response = Response.generate(true,"Database Error : Failed to Fetch Data",500,null);
          res.send(response);
      }
      if(!customer || customer == "" || customer == undefined)
      {
        console.log("No User Registered With"+req.body.email);
        response = Response.generate(true,"Error:No User Found",400,null);
      }
      else
          {
        //save last login time
        customer.lastLogin = Date.now();
        customer.save(function(err,customer)
        {
          if(err)
          {
              console.log(err);
              response = Response.generate(true,"Database Error : Error in Saving Login Time",500,null);
              res.send(response);
          }
          else
              {
                  req.session.user = customer;
                  response = Response.generate(false,"OK",200,customer);
                  res.send(response);
              }
        })
      }
    })
  });
    app.use('/login',router);
};
