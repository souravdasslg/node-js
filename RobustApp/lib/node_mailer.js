'use strict';
var events = require('events');
var mailer = require('nodemailer');

//mail functions
module.exports.mail = function (mailData) {
     //create reusable transporter object using the default SMTP transport
    console.log(mailData);
    var transporter = mailer.createTransport({
        host : 'smtp-mail.outlook.com',
        port :587,
        secure: false,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: '',
            pass: ''
        }
    });
// setup email data with unicode symbols
    var mailOptions = {
        from: '"YepKart"<noreply@yepkart.com>',
        to: mailData.mailTo,
        subject: mailData.subject,
        text: mailData.text, // plain text body
        html: '<a href = '+mailData.data+'>' // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions,function(err, info){
        if (err) {
             console.log("Mailer error :"+err);
        }
        else {
            console.log('Message %s sent: %s', info.messageId, info.response);
        }
});

};