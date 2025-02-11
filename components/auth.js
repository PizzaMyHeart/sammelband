const pool = require('../db/config');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

function loginUser(email, password, session) {

    console.log(session);
    return pool.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(result => {
        console.log(result.rows);
        if (result.rows.length > 0) {
            return bcrypt.compare(password, result.rows[0].password)
            .then(result => {
                if (result) {
                    session.loggedIn = true;
                    session.email = email;
                    console.log(session);
                    console.log('success');
                    return true;
                } else {
                    session.loggedIn = false;
                    console.log(session);
                    return false;
                }
            })
            
        } else {
            session.loggedIn = false;
            console.log(session);
            return false;
        }
    });
}

function signUpUser(email, password) {

    return checkUserExists(email)
    .then(exists => {
        if (!exists) {
            sendToken(encodeToken(email), email, 'verify');
            insertUser(email, password);
            return true;
        } else {
            console.log(`User ${email} already exists.`);
            return false;
        }
    })
}

function checkUserExists(email) {
    console.log(`Checking if ${email} exists...`);
    return pool.query(`SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`, [email])
   .then(result => {
       if (result.rows[0].exists === true) {
           return true
       } else return false;
   })
}

async function insertUser(email, password) {
    const hash = await bcrypt.hash(password, 10).then(hash => hash);
    
    pool.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, 
            [email, hash],
            (err, result) => {
                if (err) console.log(err);
                else console.log(result);
            })
            
}

function checkUserVerified(email) {
    return pool.query(`SELECT email FROM users WHERE (email = $1 and verified = true)`, [email])
    .then(result => {
        if (result.rows.length < 1) return false;
        if (result.rows[0].email === email) {
            return true;
        } else return false;
    })
}

/* Email verification */
function encodeToken(email) {
    const token = jwt.sign({email: email}, process.env.REGISTRATION_TOKEN_SECRET);
    return token;
}

async function sendToken(token, email, type) {
    let url;
    let text;
    if (type === 'verify') {
        text = 'Click on the following link to verify your email address. ';
        url = `${process.env.SERVER_URL}/api/verify?email=${token}`;
    } else if (type === 'reset') {
        text = 'Click on the following link to reset your password. '; 
        url = `${process.env.SERVER_URL}/api/reset?email=${token}`
    }

    let transporter = nodemailer.createTransport({
        pool: true,
        host:'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: {
            user: 'bound@sammelband.app',
            pass: process.env.MAIL_PASSWORD // Application password (due to 2FA)
        }
    });

    let message = {
        from: 'Sammelbot 🤖 <bound@sammelband.app>',
        to: email,
        subject: 'Verify your email address',
        text: text + url
    };

    let info = await transporter.sendMail(message);
    console.log(`Message sent: ${info.messageId}`);
}



function verifyUser(email) {
    pool.query(`UPDATE users SET verified = true WHERE email = $1`, 
    [email],
    (err, result) => {
        if (err) console.log(err);
        else console.log(result);
    })
}

/* ----- */

function resetPassword() {

}

module.exports = {loginUser, signUpUser, verifyUser, checkUserVerified, sendToken, encodeToken};