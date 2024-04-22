import 'dotenv/config';

import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.ROOT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', (req, res) => {
    const sql = `SELECT * FROM ${process.env.TABLE}`;
    db.query(sql, (err, result) => {
        if (err) res.sendStatus(500);
        res.send(result);
    });
});

app.post('/tasks', (req, res) => {
    const title = req.body.title;
    const status = req.body.status;
    const sql = `INSERT INTO ${process.env.TABLE} (title, status) VALUES ('${title}', '${status}')`;
    db.query(sql, (err, result) => {
        if (err) res.sendStatus(500);
        res.status(200).json({ id:result.insertId });
    });
});

app.put ('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const sql = `UPDATE ${process.env.TABLE} SET status = '${status}' WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) res.sendStatus(404);
        res.sendStatus(200);
    });
});

app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM ${process.env.TABLE} WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) res.sendStatus(404);
        res.sendStatus(200);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
