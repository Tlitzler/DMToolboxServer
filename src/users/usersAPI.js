import express from 'express';
import { DBConnection } from '../index.js';

const usersAPI = express.Router();

export const createUsers = () => {
  return new Promise((resolve, reject) => {
    let sql = 'CREATE TABLE IF NOT EXISTS users(email VARCHAR(255), ' +
              'firstname VARCHAR(255), ' +
              'lastname VARCHAR(255), ' +
              'password VARCHAR(255), ' +
              'id INT AUTO_INCREMENT, ' +
              'PRIMARY KEY(id))';
    DBConnection.query(sql, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}

const getExistingUser = (email) => {
  return new Promise((resolve, reject) => {
    let verifySQLQuery = `SELECT * FROM users WHERE email=\'${email}\'`;
    DBConnection.query(verifySQLQuery, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  })
};

usersAPI.post('/adduser', async (req, res) => {
  let post = req.query;
  
  const test = await getExistingUser(post.email);

  console.log('Result of test :: ', typeof test, test.length);

  if (test.length < 1) {
    console.log('Adding User...');
    let insertSQLQuery = 'INSERT INTO users SET ?';
    DBConnection.query(insertSQLQuery, post, err => {
      if (err) {
        throw err;
      }
    });
    res.send(200, {userAdded: post});
  } else {
    res.status(400).send('A User with this email already exists.');
  }
  
});

usersAPI.get('/fetchuser', async (req, res) => {
  const post = req.query;

  const retrievedUser = await getExistingUser(post);
  res.send(200, { user: retrievedUser });
});

usersAPI.get('/authenticateuser', async (req, res) => {
  const post = req.query.email;
  const retrievedUser = await getExistingUser(post);

  if (!retrievedUser || req.query.password !== retrievedUser[0].password) {
    res.send(400, 'Unable to authenticate User.');
    return;
  }

  res.send(200, retrievedUser);
});

export default usersAPI;