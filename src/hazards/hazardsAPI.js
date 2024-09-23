import express from 'express';
import { runQuery } from '../index.js';

const hazardsAPI = express.Router();

export const createHazards = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS hazards(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'type VARCHAR(255), ' +
                'description TEXT, ' +
                'imageId INT, ' +
                'multiplier BOOLEAN, ' +
                'challengeModifier INT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}