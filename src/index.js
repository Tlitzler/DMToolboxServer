import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import usersAPI, { createUsers } from './users/usersAPI.js';
import campaignsAPI, { 
    createParties,
    createFolders,
    createFolderContents,
    createCampaigns,
} from './campaigns/campaignsAPI.js';
import { createCharacters } from './characters/charactersAPI.js';
import { createEnemies } from './enemies/enemiesAPI.js';
import { createHazards } from './hazards/hazardsAPI.js';
import { createEncounters } from './encounters/encountersAPI.js';
import { createEncounterTables } from './encounterTables/encounterTablesAPI.js';
import { createFactions } from './factions/factionsAPI.js';
import { createEvents } from './events/eventsAPI.js';
import { createLocations } from './locations/locationsAPI.js';
import mapsAPI, { createMaps } from './maps/mapsAPI.js';
import { createItems } from './items/itemsAPI.js';

// Create connection to the DB
export const DBConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dmtoolbox',
});

// Connect to MySQL
DBConnection.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');
});

// Initialize express
const app = express();

// Add CORS Access-Control-Allow-Origin header
app.use(cors({
    origin: 'http://localhost:4448',
}));

// Middleware
export const runQuery = (sql, values) => {
    return new Promise((resolve, reject) => {
        DBConnection.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

export const insertQuery = (sql) => {
    return new Promise((resolve, reject) => {
        runQuery(sql)
            .then(() => {
                return runQuery('SELECT LAST_INSERT_ID() as id');
            })
            .then(results => {
                resolve(results[0].id);
            })
            .catch(err => {
                reject(err);
            });
    });
}

// Create Keys Table
export const createKeysTable = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS keystable(keyName VARCHAR(255), ' +
                'keyId INT AUTO_INCREMENT, ' +
                'objectType VARCHAR(255), ' +
                'PRIMARY KEY(keyId))';
    return runQuery(sql);
}

// helper function to insert keys into the keys table
export const insertKeys = (keys) => {
    const values = keys.map(key => `('${key.keyName}', '${key.objectType}')`).join(', ');
    const sql = `INSERT INTO keystable (keyName, objectType) VALUES ${values}`;
    return runQuery(sql);
}

// Create Array Values Table
export const createArrayValues = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS arrayvalues(value VARCHAR(255), ' +
                'objectId INT, ' +
                'keyId INT, ' +
                'PRIMARY KEY(objectId, objectType, keyId, value))';
    return runQuery(sql);
}

// Create Database
app.get('/createdb', (req, res) => {
        let sql = 'CREATE DATABASE dmtoolbox';
        DBConnection.query(sql, err => {
    if (err) {
        throw err;
    }
        res.send('Database Successfully Created');
    });
});

// Create Users Table
app.get('/createusers', async (req, res) => {
    try{
        await createUsers();
        res.send('Users Table Successfully created');
    } catch (err) {
        throw err;
    }
});

// Create Campaigns Table and all required tables
app.get('/createcampaigns', async (req, res) => {
    try{
        const keys = [];
        await createKeysTable();
        await createArrayValues();
        await createCharacters();
        keys.push(...[
            {keyName: 'factionIds', objectType: 'characters'},
            {keyName: 'eventIds', objectType: 'characters'},
            {keyName: 'class', objectType: 'characters'},
            {keyName: 'itemIds', objectType: 'characters'},
        ]);
        await createEnemies();
        keys.push(...[
            {keyName: 'factionIds', objectType: 'enemies'},
            {keyName: 'itemIds', objectType: 'enemies'},
        ]);
        await createHazards();
        await createEncounters();
        keys.push(...[
            {keyName: 'enemies', objectType: 'encounters'},
            {keyName: 'hazards', objectType: 'encounters'},
        ]);
        await createEncounterTables();
        keys.push(...[
            {keyName: 'environments', objectType: 'encounterTables'},
            {keyName: 'locationIds', objectType: 'encounterTables'},
            {keyName: 'encounters', objectType: 'encounterTables'},
        ]);
        await createFactions();
        keys.push(...[
            {keyName: 'characterIds', objectType: 'factions'},
            {keyName: 'enemyIds', objectType: 'factions'},
            {keyName: 'eventIds', objectType: 'factions'},
        ]);
        await createEvents();
        await createLocations();
        keys.push(...[
            {keyName: 'characterIds', objectType: 'locations'},
            {keyName: 'eventIds', objectType: 'locations'},
            {keyName: 'factionIds', objectType: 'locations'},
            {keyName: 'encounterTableIds', objectType: 'locations'},
        ])
        await createMaps();
        keys.push(...[
            {keyName: 'locationIds', objectType: 'maps'},
        ]);
        await createParties();
        keys.push(...[
            {keyName: 'characterIds', objectType: 'parties'},
            {keyName: 'enemyIds', objectType: 'parties'},
            {keyName: 'factionIds', objectType: 'parties'},
        ]);
        await createItems();
        await createFolders();
        await createFolderContents();
        await createCampaigns();
        keys.push(...[
            {keyName: 'characters', objectType: 'campaigns'},
            {keyName: 'enemies', objectType: 'campaigns'},
            {keyName: 'hazards', objectType: 'campaigns'},
            {keyName: 'encounters', objectType: 'campaigns'},
            {keyName: 'encounterTables', objectType: 'campaigns'},
            {keyName: 'factions', objectType: 'campaigns'},
            {keyName: 'events', objectType: 'campaigns'},
            {keyName: 'locations', objectType: 'campaigns'},
            {keyName: 'maps', objectType: 'campaigns'},
            {keyName: 'parties', objectType: 'campaigns'},
            {keyName: 'items', objectType: 'campaigns'},
            {keyName: 'folders', objectType: 'campaigns'},
        ]);
        await insertKeys(keys);
        res.send('All required Campaigns Tables Successfully created');
    } catch (err) {
        throw err;
    }
});

// Add routing for APIs
app.use('/users', usersAPI);
app.use('/campaigns', campaignsAPI);
app.use('/maps', mapsAPI);

app.listen('3000', () => {
  console.log('Server Started on port 3000');
});
