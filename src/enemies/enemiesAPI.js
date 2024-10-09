import express from 'express';
import { runQuery } from '../index.js';

const enemiesAPI = express.Router();

export const createEnemies = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS enemies(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'challengeRating INT, ' +
                'imageURL VARCHAR(255), ' +
                'description TEXT, ' +
                'hp INT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}