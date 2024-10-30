import express from 'express';
import { runQuery } from '../index.js';
import { DBConnection } from '../index.js';

const mapsAPI = express.Router();
mapsAPI.use(express.json());

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

export const fetchMap = async (id) => {
    const sql = 'SELECT * FROM maps WHERE id = ?';
    return runQuery(sql, [id]);
}

mapsAPI.post('/addmap', async (req, res) => {
    let post = req.body;

    console.log('CUSTOM LOG testing post in add map :: ', post);

    let sql = `
        INSERT INTO maps 
        (userId, name, imageURL, description, locationId, hexes, width, height, scale) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const mapTableValues = [
        post.userId, 
        post.name, 
        post.imageURL, 
        post.description, 
        post.locationId === -1 ? null : post.locationId, 
        post.hexes, 
        post.width, 
        post.height, 
        post.scale
    ];

    DBConnection.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Transaction failed', details: err});

        runQuery(sql, mapTableValues)
        .then((value) => {
            sql = `
                SELECT keyId FROM keystable 
                WHERE keyName = 'maps' AND objectType = 'campaigns'
                LIMIT 1
            `;
            runQuery(sql).then((result) => {
                sql = `
                    INSERT INTO arrayvalues 
                    (value, objectId, keyId)
                    VALUES (?, ?, ?)
                `;
                const arrayValues = [value.insertId, post.campaignId, result[0].keyId];
                runQuery(sql, arrayValues).then(() => {
                    DBConnection.commit((err) => {
                        if (err) return res.status(500).json({ error: 'Commit failed', details: err});
                        res.status(200).json({mapId: value.insertId});
                    });
                });
            });
        }).catch((err) => {
            DBConnection.rollback(() => {
                return res.status(500).json({ error: 'Transaction failed', details: err});
            })
        })
    });
});

export default mapsAPI;