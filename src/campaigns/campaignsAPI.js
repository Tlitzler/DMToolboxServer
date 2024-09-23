import express from 'express';
import { runQuery } from '../index.js';

const campaignAPI = express.Router();

export const createParties = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS parties(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'imageId INT, ' +
                'tokenImageId INT, ' +
                'description TEXT, ' +
                'mapId INT, ' +
                'x INT, ' +
                'y INT, ' +
                'locationId INT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}

export const createFolders = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS folders(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}

export const createFolderContents = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS foldercontents(parentFolderId INT, ' +
                'objectType VARCHAR(255), ' +
                'objectId INT, ' +
                'PRIMARY KEY(parentFolderId, objectId, objectType))';
    return runQuery(sql);
}

export const createCampaigns = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS campaigns(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'imageId INT, ' +
                'description TEXT, ' +
                'date DATE, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}
