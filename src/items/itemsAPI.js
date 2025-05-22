import express from 'express';
import { DBConnection, runQuery } from '../index.js';

const itemsAPI = express.Router();
itemsAPI.use(express.json());

export const createItems = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS items(name VARCHAR(255), ' +
                'id INT AUTO_INCREMENT, ' +
                'userId INT, ' +
                'imageURL VARCHAR(255), ' +
                'description TEXT, ' +
                'value INT, ' +
                'PRIMARY KEY(id))';
    return runQuery(sql);
}

export const fetchItem = async (id) => {
    const sql = 'SELECT * FROM items WHERE id = ?';
    return runQuery(sql, [id]);
};

itemsAPI.post('/additem', async (req, res) => {
    let post = req.body;

    console.log('Adding Item...');
    console.log('Post :: ', post);

    let sql = `
        INSERT INTO items 
        (userId, name, imageURL, description, value) 
        VALUES 
        (?, ?, ?, ?, ?)`;
    const values = [post.userId, post.name, post.imageURL, post.description, post.value];

    DBConnection.beginTransaction((err) => {
        runQuery(sql, values).then((value) => {
            sql = `
                SELECT keyId FROM keystable 
                WHERE keyName = 'items' AND objectType = 'campaigns'
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
                        if (err) return res.status(500).json({ error: 'Transaction commit failed', details: err });
                        res.status(200).json({ itemId: value.insertId });
                    });
                });
            })
        })
        .catch((err) => {
            DBConnection.rollback(() => {
                return res.status(500).json({ error: 'Error adding item', details: err });
            });
        });
    });
});

itemsAPI.put('/updateitem', async (req, res) => {
    let post = req.body;

    let sql = `
        UPDATE items 
        SET name = ?, imageURL = ?, description = ?, value = ? 
        WHERE id = ?`;
    const values = [post.name, post.imageURL, post.description, post.value, post.id];

    runQuery(sql, values)
        .then(() => {
            res.status(200).json({ itemId: post.id });
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

itemsAPI.delete('/deleteitem', async (req, res) => {
    let post = req.body;

    let sql = 'DELETE FROM items WHERE id = ?';
    const values = [post.id];

    DBConnection.beginTransaction((err) => {
        runQuery(sql, values).then(() => {
            sql = `
                SELECT keyId FROM keystable 
                WHERE keyName = 'items' AND objectType = 'campaigns'
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
                        res.status(200).json({ itemId: post.id });
                    });
                });
            })
        })
        .catch((err) => {
            DBConnection.rollback(() => {
                return res.status(500).json({ error: 'Error deleting item', details: err });
            });
        });
    });
});

export default itemsAPI;