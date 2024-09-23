import express from 'express';
import { runQuery } from '../index.js';

const charactersAPI = express.Router();

export const createCharacters = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS characters(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'isPlayer BOOLEAN, ' +
                'userId INT, ' +
                'imageId INT, ' +
                'description TEXT, ' +
                'locationId INT, ' +
                'goals TEXT, ' +
                'status TEXT, ' +
                'hp INT, ' +
                'level INT, ' +
                'platinum INT, ' +
                'gold INT, ' +
                'silver INT, ' +
                'copper INT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}