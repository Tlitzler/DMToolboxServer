import express from 'express';
import { runQuery } from '../index.js';

const factionsAPI = express.Router();

export const createFactions = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS factions(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'imageId INT, ' +
                'description TEXT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}