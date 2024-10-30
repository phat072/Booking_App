const express = require('express');
const connectedDB = require('./configs/database'); 

const app = express();

connectedDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the application!');
});

