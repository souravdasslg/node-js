var api_key = 'enter your api key here';
var domain = 'enter your domain here';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports.mail = function(mailData) {

    var data = {
        from   : 'Yepkart<no-reply@yepkart.com>',
        to     : mailData.mailTo,
        subject: mailData.subject,
        html   : "<p>"+mailData.text+"</p><p>"+mailData.data+"</p>"
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });

};