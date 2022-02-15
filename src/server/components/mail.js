const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function mail(id, email, res) {
    console.log(`sessionID for email: ${id}`);
    console.log(`Sending to ${email}`);
    const html = fs.readFileSync(path.join(__dirname, `../public/sammelband-${id}.html`), 'utf8');
    
    let transporter = nodemailer.createTransport({
        pool: true,
        host:'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: {
            user: 'bound@sammelband.app',
            pass: process.env.MAIL_PASSWORD
        }
    });


    let info = await transporter.sendMail({
        from: '<bound@sammelband.app>',
        to: email,
        subject: 'Sammelband',
        html: html
    });
    
    console.log(`Message sent: ${info.messageId}`);
    res.send('Email sent');
    
}

module.exports = mail;