// app.js
require('dotenv').config();
const express = require('express');
const hostedZonesRouter = require('./routes/hostedZones');
const indexRouter = require('./routes/index')

const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const connectToDb = require('./DB/connection');

// Use the hosted zones router

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(indexRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectToDb();
});
