const pool = require('../db/config');
const bcrypt = require('bcrypt');

function loginUser(email, password, session) {
    /*
    pool.query(`SELECT * FROM users WHERE (email = $1 and password = $2)`, [email, password], (err, result) => {
        if (err) console.log(err);
        console.log(result.rows);
        console.log(result.rows.length);
        if (result.rows.length > 0) {
            session.loggedIn = true;
            session.email = email;
        } else {
            throw new Error ('Incorrect credentials');
        }
        console.log(session);
        
    })
    */
    console.log(session);
    return pool.query(`SELECT * FROM users WHERE (email = $1 and password = $2)`, [email, password])
    .then(result => {
        console.log(result.rows);
        if (result.rows.length > 0) {
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
    });
}

function signUpUser(email, password) {
    
    /*
    pool.query(`SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`, [email], (err, result) => {
        if (err) console.log(err);
        if (result.rows[0].exists === true) {
            console.log('User already exists');
            res.send('User already exists.');
        } else {
            pool.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, 
            [email, password],
            (err, result) => {
                if (err) console.log(err);
                else {res.send('Signup successful.')};
            })
        }
    


    })
    */
    return checkUserExists(email)
    .then(exists => {
        if (!exists) {
            console.log('Inserting new user into database');
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

function insertUser(email, password) {
    pool.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, 
            [email, password],
            (err, result) => {
                if (err) console.log(err);
                else console.log(result);
            })
}

module.exports = {loginUser, signUpUser};