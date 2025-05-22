import express from 'express';
import { DBConnection, runQuery } from '../index.js';

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

    console.log('Adding Map...');
    console.log('Post :: ', post);

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
            });
        });
    });
});

mapsAPI.put('/updatemap', async (req, res) => {
    let post = req.body;

    console.log('Updating Map...');
    console.log('Post :: ', post);

    let sql = `
        UPDATE maps 
        SET name = ?, imageURL = ?, description = ?, locationId = ?, hexes = ?, width = ?, height = ?, scale = ? 
        WHERE id = ?`;
    const mapTableValues = [
        post.name, 
        post.imageURL, 
        post.description, 
        post.locationId === -1 ? null : post.locationId, 
        post.hexes, 
        post.width, 
        post.height, 
        post.scale,
        post.id
    ];

    runQuery(sql, mapTableValues)
        .then(() => {
            res.status(200).json({mapId: post.id});
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

mapsAPI.delete('/deletemap', async (req, res) => {
    let post = req.body;

    let sql = 'DELETE FROM maps WHERE id = ?';
    const values = [post.id];

    DBConnection.beginTransaction((err) => {
        runQuery(sql, values).then(() => {
            sql = `
                SELECT keyId FROM keystable 
                WHERE keyName = 'maps' AND objectType = 'campaigns'
                LIMIT 1
            `;
            runQuery(sql).then((result) => {
                sql = `
                    DELETE FROM arrayvalues 
                    WHERE value = ? AND objectId = ? AND keyId = ?
                `;
                const arrayValues = [post.id, post.campaignId, result[0].keyId];
                runQuery(sql, arrayValues).then(() => {
                    DBConnection.commit((err) => {
                        if (err) return res.status(500).json({ error: 'Transaction commit failed', details: err });
                        res.status(200).json({ mapId: post.id });
                    });
                });
            });
        })
    });
});

export default mapsAPI;