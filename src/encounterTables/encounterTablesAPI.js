import express from 'express';
import { runQuery } from '../index.js';

const encounterTablesAPI = express.Router();

export const createEncounterTables = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS encountertables(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'encounterId INT, ' +
                'enemyId INT, ' +
                'hazardId INT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}