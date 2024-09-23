import express from 'express';
import { runQuery } from '../index.js';

const eventsAPI = express.Router();

export const createEvents = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS events(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'date DATE, ' +
                'description TEXT, ' +
                'duration INT, ' +
                'outcome TEXT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}

export const createEventInvolvements = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS eventinvolvements(eventId INT, ' +
                'objectId INT, ' +
                'objectType VARCHAR(255), ' +
                'involvement TEXT, ' +
                'PRIMARY KEY(eventId, objectId, objectType))';
    return runQuery(sql);
}
