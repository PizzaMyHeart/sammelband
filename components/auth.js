const pool = require('../db/config');

function loginUser(username, password, session) {
    pool.query(`SELECT * FROM users WHERE username = $1`, [username], (err, result) => {
        if (err) console.log(err);
        console.log(result.rows);
        if (result.rows.length > 0) {
            session.loggedIn = true;
            session.username = username;
        }
        console.log(session);
        
    })
}

function newUser(username, password, email, res) {
    console.log(`Checking if ${username} exists...`);
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
}

module.exports = {loginUser, newUser};