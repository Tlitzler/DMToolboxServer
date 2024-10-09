import express from 'express';
import { runQuery } from '../index.js';

const itemsAPI = express.Router();

export const createItems = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS items(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'imageURL VARCHAR(255), ' +
                'description TEXT, ' +
                'value INT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}
