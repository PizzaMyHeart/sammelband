// Create a database connection pool

require('dotenv').config();
const { Pool } = require('pg');

const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
console.log(connectionString);
const pool = new Pool ({
    connectionString: connectionString,
    ssl: false 
});

module.exports = pool;