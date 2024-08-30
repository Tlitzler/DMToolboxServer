import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import usersAPI from './users/usersAPI.js';

// Create connection to the DB
export const DBConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'dmtoolbox',
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
  let sql = 'CREATE DATABASE dmtoolbox';
  DBConnection.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send('Database Successfully Created');
  });
});

// Create Users Table
app.get('/createusers', (req, res) => {
  let sql = 'CREATE TABLE users(email VARCHAR(255), ' +
            'firstname VARCHAR(255), ' +
            'lastname VARCHAR(255), ' +
            'password VARCHAR(255), ' +
            'id INT AUTO_INCREMENT, ' +
            'PRIMARY KEY(id))';
  DBConnection.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send('Users Table Successfully created');
  });
});

// Create Campaigns Table
app.get('/createcampaigns', (req, res) => {
  let sql = 'CREATE TABLE campaigns(campaignname VARCHAR(255), ' +
            'campaignid INT AUTO_INCREMENT, ' +
            'PRIMARY KEY(campaignid))';
  DBConnection.query(sql, err => {
    if (err) {
      throw err;
    }
    res.send('Campaigns Table Successfully created');
  });
});

// Add routing for APIs
app.use('/users', usersAPI);

app.listen('3000', () => {
  console.log('Server Started on port 3000');
});
















//Messing with MongoDB

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://Tlitzler:Fr3nchT0a$t@dmtoolbox.5jeyg.mongodb.net/?retryWrites=true&w=majority&appName=DMToolbox";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
