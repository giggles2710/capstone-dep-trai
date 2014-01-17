/**
 * Created by Noir on 12/27/13.
 */

'use strict'

var path =require('path'),
    // ejs = require('ejs'),
    // fs = require('fs'),
    HOME = path.normalize(__dirname + '/..'),
    configMail = require(path.join(HOME + '/config/mail')),
    nodemailer = require('nodemailer'),
    emailTemplates = require('email-templates'),
    templatesDir = path.resolve(path.join(HOME + '/views/mail_templates'));

// create a default transport using gmail and authentication that
// stored in the config.js file
var defaultTransport = nodemailer.createTransport('SMTP',{
    service: 'gmail',
    auth:{
        user: configMail.mailer.auth.user,
        pass: configMail.mailer.auth.pass
    }
});

exports.sendResetPasswordMail = function(email, resetUrl, createDate, cb){
    // make sure that we have an user email
    if(!email){
        return cb(new Error('Email address required.'));
    }

    var local = {
        email: email,
        subject: 'Reset TopNet password',
        resetUrl: resetUrl,
        requestDate: createDate
    }

    emailTemplates(templatesDir, function(err, template){
        if(err) return cb(err);

        // send a single mail
        template('password_reset', local, function(err, html, text){
            if(err) return cb(err);

            // render email
//            var emailTemplate = fs.readFileSync(path.join(HOME + '/views/mail_templates/html.esjs','utf8'));
//            var emailRendered = ejs.render(emailTemplate, {
//                resetUrl: resetUrl,
//                requestDate: createDate
//            });

            defaultTransport.sendMail({
                from: configMail.mailer.defaultFromAddress,
                to: local.email,
                subject: local.subject,
                html: html,
                text: text
            }, function(err, responseStatus){
                if(err) return cb(err);

                return cb(null, responseStatus.message, html, text);
            });
        });
    });
}

exports.sendSingleMail = function(templateName, email, subject, cb){
    // make sure that we have an user email
    if(!email){
        return cb(new Error('Email address required.'));
    }
    // make sure that we have a message
    if(!subject){
        return cb(new Error('Must input subject and content.'));
    }

    var local = {
        email: email,
        subject: subject
    }

    emailTemplates(templatesDir, function(err, template){
        if(err) return cb(err);

        // send a single mail
        template(templateName, local, function(err, html, text){
            if(err) return cb(err);

            defaultTransport.sendMail({
                from: configMail.mailer.defaultFromAddress,
                to: local.email,
                subject: local.subject,
                html: html,
                text: text
            }, function(err, responseStatus){
                if(err) return cb(err);

                return cb(null, responseStatus.message, html, text);
            });
        });
    });
}

//exports.sendMultipleEmail = function(templateName, locals, cb){
//    // prepare node mailer transport object
//    if(locals.length < 0) return cb("Please input user list.");
//
//    var Render = function(local){
//        this.local = local;
//        this.send = function(err, html, text){
//            if(err){
//                console.log(err);
//            }else{
//                defaultTransport.sendMail({
//                    from: configMail.mailer.defaultFromAddress,
//                    to: local.email,
//                    subject: local.subject,
//                    html: html,
//                    text: text
//                },function(err, responseStatus){
//                    if(err){
//                        console.log(err);
//                    }else{
//                        console.log(responseStatus.message);
//                    }
//                });
//            }
//        };
//        this.batch = function(batch){
//            batch(this.local, templatesDir, this.send);
//        }
//    };
//
//    // load the template and send the emails
//    template(templateName, true, function(err, batch){
//        for(var user in users){
//            var render = new Render(users[user]);
//            render.batch(batch);
//        }
//    });
//}

