import express from 'express';
import { runQuery } from '../index.js';

const campaignsAPI = express.Router();
campaignsAPI.use(express.json());

export const createParties = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS parties(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'imageURL VARCHAR(255), ' +
                'tokenimageURL VARCHAR(255), ' +
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
                'imageURL VARCHAR(255), ' +
                'description TEXT, ' +
                'date DATE, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}

campaignsAPI.post('/addcampaign', async (req, res) => {
    let post = req.body;

    let sql = `
        INSERT INTO campaigns 
        (userId, name, imageURL, description, date) 
        VALUES 
        (?, ?, ?, ?, NULL)`;
    const values = [post.userId, post.name, post.imageURL, post.description];

    runQuery(sql, values)
        .then((value) => {
            res.send(200, {campaignId: value.insertId});
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

campaignsAPI.get('/fetchcampaigns', async (req, res) => {
    let sql = 'SELECT * FROM campaigns WHERE userId = ?';
    const values = [req.query.userId];
    runQuery(sql, values)
        .then((results) => {
            res.send(200, {campaigns: results});
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

export default campaignsAPI;