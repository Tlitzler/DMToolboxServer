import express from 'express';
import { runQuery } from '../index.js';

const locationsAPI = express.Router();

export const createLocations = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS locations(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'imageURL VARCHAR(255), ' +
                'description TEXT, ' +
                'mapId INT, ' +
                'mapIconId INT, ' +
                'iconSize INT, ' +
                'x INT, ' +
                'y INT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}
