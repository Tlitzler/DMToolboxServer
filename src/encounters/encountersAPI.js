import express from 'express';
import { runQuery } from '../index.js';

const encountersAPI = express.Router();

export const createEncounters = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS encounters(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'type VARCHAR(255), ' +
                'challengeRating INT, ' +
                'environment VARCHAR(255), ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}