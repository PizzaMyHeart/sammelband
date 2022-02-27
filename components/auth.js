const pool = require('../db/config');
const bcrypt = require('bcrypt');

function loginUser(username, password, session) {
    /*
    pool.query(`SELECT * FROM users WHERE (username = $1 and password = $2)`, [username, password], (err, result) => {
        if (err) console.log(err);
        console.log(result.rows);
        console.log(result.rows.length);
        if (result.rows.length > 0) {
            session.loggedIn = true;
            session.username = username;
        } else {
            throw new Error ('Incorrect credentials');
        }
        console.log(session);
        
    })
    */
    return pool.query(`SELECT * FROM users WHERE (username = $1 and password = $2)`, [username, password])
    .then(result => {
        console.log(result.rows);
        if (result.rows.length > 0) {
            session.loggedIn = true;
            session.username = username;
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

function signUpUser(username, password, email, res) {
    
    /*
    pool.query(`SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`, [username], (err, result) => {
        if (err) console.log(err);
        if (result.rows[0].exists === true) {
            console.log('User already exists');
            res.send('User already exists.');
        } else {
            pool.query(`INSERT INTO users (username, password, email) VALUES ($1, $2, $3)`, 
            [username, password, email],
            (err, result) => {
                if (err) console.log(err);
                else {res.send('Signup successful.')};
            })
        }
    


    })
    */
    return checkUserExists(username)
    .then(exists => {
        if (!exists) {
            console.log('Inserting new user into database');
            insertUser(username, password, email);
            return true;
        } else {
            console.log(`User ${username} already exists.`);
            return false;
        }
    })
}

function checkUserExists(username) {
    console.log(`Checking if ${username} exists...`);
    return pool.query(`SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`, [username])
   .then(result => {
       if (result.rows[0].exists === true) {
           return true
       } else return false;
   })
}

function insertUser(username, password, email) {
    pool.query(`INSERT INTO users (username, password, email) VALUES ($1, $2, $3)`, 
            [username, password, email],
            (err, result) => {
                if (err) console.log(err);
                else console.log(result);
            })
}

module.exports = {loginUser, signUpUser};