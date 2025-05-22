import express from 'express';
import { runQuery } from '../index.js';
import { fetchMap } from '../maps/mapsAPI.js';
import { fetchItem } from '../items/itemsAPI.js';

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
                'userId INT NOT NULL, ' +
                'imageURL VARCHAR(255), ' +
                'defaultMapId INT, ' +
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
            res.status(200).json({campaignId: value.insertId});
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

campaignsAPI.put('/setdefaultmap', async (req, res) => {
    let post = req.body;

    let sql = 'UPDATE campaigns SET defaultMapId = ? WHERE id = ?';
    const values = [post.mapId, post.campaignId];

    runQuery(sql, values)
        .then(() => {
            res.status(200).json({defaultMapId: post.mapId});
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

const defaultCampaign = {
    userId: 0,
    name: '',
    id: 0,
    description: '',
    defaultMapId: null,
    characters: [],
    enemies: [],
    hazards: [],
    encounters: [],
    encounterTables: [],
    factions: [],
    events: [],
    locations: [],
    maps: [],
    parties: [],
    items: [],
    folders: [],
    date: '',
};

campaignsAPI.get('/fetchcampaigns', async (req, res) => {
    try {
        let sql = 'SELECT * FROM campaigns WHERE userId = ? ORDER BY id ASC';
        const values = [req.query.userId];
        const results = await runQuery(sql, values)
        const formattedCampaigns = results.map(campaign => ({...JSON.parse(JSON.stringify(defaultCampaign)), ...campaign}));
                
        sql = `
            SELECT campaigns.id, keystable.keyName, arrayvalues.value
            FROM campaigns
            JOIN arrayvalues ON campaigns.id = arrayvalues.objectId
            JOIN keystable ON arrayvalues.keyId = keystable.keyId
            WHERE campaigns.userId = ?
            ORDER BY campaigns.id ASC
        `;

        const keyValuePairs = await runQuery(sql, values);

        for (const row of keyValuePairs) {
            
            switch (row.keyName) {
                case 'maps':
                    const map = await fetchMap(row.value);
                    formattedCampaigns.find(campaign => campaign.id === row.id).maps.push(map[0]);
                    break;
                case 'items':
                    const item = await fetchItem(row.value);
                    formattedCampaigns.find(campaign => campaign.id === row.id).items.push(item[0]);
                default:
                    break;
            }
        }

        res.status(200).json({campaigns: formattedCampaigns});
    } catch (err) {
        res.status(400).send(err);
    }
});

export default campaignsAPI;