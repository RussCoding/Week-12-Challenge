const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: 'employee_tracker_db'
    },    
    console.log('Connected to the employee_tracker_db databse')
);

module.exports = db;