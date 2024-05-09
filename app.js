// app.js
require('dotenv').config();
const express = require('express');
const hostedZonesRouter = require('./routes/hostedZones');

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')

// Use the hosted zones router

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/hosted-zones', hostedZonesRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
