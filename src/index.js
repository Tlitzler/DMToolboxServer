import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import usersAPI from './users/usersAPI.js';

// Create connection to the DB
export const DBConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mapmanager',
});

// Connect to MySQL
DBConnection.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected');
});

// Initialize express
const app = express();

// Add CORS Access-Control-Allow-Origin header
app.use(cors({
  origin: 'http://localhost:4448',
}));

// Add parsing for JSON bodies
// app.use(express.json());

// Create Database
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE mapmanager';
  DBConnection.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send('Database Successfully Created');
  });
});

// Create Table
app.get('/createusers', (req, res) => {
  let sql = 'CREATE TABLE users(email VARCHAR(255), ' +
            'firstname VARCHAR(255), ' +
            'lastname VARCHAR(255), ' +
            'password VARCHAR(255), ' +
            'PRIMARY KEY(email))';
  DBConnection.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send('Users Table Successfully created');
  });
});

// Add routing for APIs
app.use('/users', usersAPI);

app.listen('3000', () => {
  console.log('Server Started on port 3000');
});