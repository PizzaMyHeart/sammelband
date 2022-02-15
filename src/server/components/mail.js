const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function mail(req, res) {
    const [id, email, type, format] = [req.session.id, 
                                    req.session.body.email, 
                                    req.query.type,
                                    req.session.body.format
                                    ];
    if (!email) throw 'No email address supplied';
    if (type!='body' && type!='attachment') throw 'Mail error: No email type defined.';
    console.log(`sessionID for email: ${id}`);
    console.log(`Sending as ${type} to ${email}`);
    
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

    
    let message = {
        from: 'Sammelbot 🤖 <bound@sammelband.app>',
        to: email,
        subject: 'Sammelband'
    }

    if (type == 'attachment') {
        message.attachments = [{
            filename: `sammelband.${format}`,
            path: path.join(__dirname, `../public/sammelband-${id}.${format}`)
        }];
    } else if (type == 'body') {
        message.html = html
    }

    let info = await transporter.sendMail(message);
    console.log(`Message sent: ${info.messageId}`);
    
    res.send('Email sent');
    
}

module.exports = mail;