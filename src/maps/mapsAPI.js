import express from 'express';
import { runQuery } from '../index.js';

const mapsAPI = express.Router();

export const createMaps = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS maps(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'imageURL VARCHAR(255), ' +
                'description TEXT, ' +
                'locationId INT, ' +
                'hexes BOOLEAN, ' +
                'width INT, ' +
                'height INT, ' +
                'scale INT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}
