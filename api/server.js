const express = require('express');
const app = express()
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors')
const bcrypt = require('bcrypt');


app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
    //host: process.env.DB_HOST,
   //user: process.env.DB_USER,
    //password: process.env.DB_PASSWORD,
    //database: process.env.DB_NAME
    host: '127.0.0.1',
    user: 'root',
    password: 'Vill@4171#',
    
    
})

db.connect((err) => {
    if (err) {
        return console.log('Error connecting to MySQL:', err.message);
    
     }
    console.log('Connected to MySQL as id:', db.threadId);
 
   
    // Create database if it does not exist
    db.query(`CREATE DATABASE IF NOT EXISTS Vitronicsstore_DB`, (err, result) => {
        if (err) return console.log('Error creating database');
        console.log('Database Vitronicsstore_DB created Successfully');

        // Switch to the expense_tracker database
        db.changeUser({ database: 'Vitronicsstore_DB' }, (err) => {
            if (err) throw err;
            console.log('Switched to Vitronicsstore_DB database');

            // Create users table if it does not exist
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    username VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL
                )
            `;
            db.query(createUsersTable, (err, result) => {
                if (err) throw err;
                console.log('Users table created successfully');
            });
        });
    });
});

// create a database


// User registration route
app.post('/api/register', async(req, res) => {
    try{
        // check if user email exists
        const user = `SELECT * FROM users WHERE email = ?`

        //
        db.query(user, [req.body.email], (err, data) => {
            if(data.length) return res.status(409).json({ "message": "User already exists!" });

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            const newUser = `INSERT INTO users(email, username, password) VALUES (?) `
            value = [
                req.body.email,
                req.body.username,
                hashedPassword
            ]

            // adding the new user to the database
            db.query(newUser, [value], (err, data) => {
                if(err) return res.status(500).json({ "message": "Something went wrong, User cannot be created! Try again later" });

                return res.status(200).json({ "message": "User created successfully! Something went wrong, User cannot be created! Try again later" })
            })
        })
        
    } catch(err) {
        res.status(500).json({ "message": "Something went wrong" })
    }
})


// user login route
app.post('/api/login', async(req, res) => {
    try{
        const user = `SELECT * FROM users WHERE email = ?`
        
        db.query(user, [req.body.email], (err, data) => {
            if(data.length === 0) return res.status(404).json({ "message": "User not found!" })

            const isPasswordValid = bcrypt.compareSync(req.body.password, data[0].password);

            if(!isPasswordValid) return res.status(400).json({ "message": "Invalid email or password" });

            return res.status(200).json({ "message": "Login successful" });
        })
    } catch(err) {
        res.status(500).json(err)
    } 
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
})
