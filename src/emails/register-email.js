const nodemailer = require('nodemailer');
const fs = require('fs');

const userModel = require('../models/user');

const registerTemplate = fs.readFileSync(__dirname + '/templates/register-email-template.html', 'utf8');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS   
    }
});


function registerEmail(email, pass){
    const loginLink = `http://localhost:5173/verify-account?email=${email}&pass=${pass}`
    const htmlTemplate = registerTemplate.replace('{{link}}', loginLink);

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verifica tu Email',
        html: htmlTemplate
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.error('Error sending email', err);
        }else{
            console.log('Email sent');
            res.status(201).send({
                message: 'Profile created',
                success: true
        })
        }
    })
}


module.exports = registerEmail