// routes/hostedZones.js
const express = require('express');
const router = express.Router();
const { listHostedZones, createHostedZone ,createRecord,fetchRecordsForHostedZone } = require('../services/awsService');

// Existing GET route
router.get('/', async (req, res) => {
  try {
    const hostedZones = await listHostedZones();
    res.json(hostedZones);
  } catch (error) {
    console.error('Error fetching hosted zones:', error);
    res.status(500).send('Failed to fetch hosted zones');
  }
});

// New POST route
router.post('/', async (req, res) => {
    console.log(" body : ",req.body);
  const { domainName, callerReference, comment, isPrivateZone, vpcId, vpcRegion } = req.body;
  try {
    const hostedZone = await createHostedZone(domainName, callerReference, comment, isPrivateZone, vpcId, vpcRegion);
    res.status(201).json(hostedZone);
  } catch (error) {
    console.error('Error creating hosted zone:', error);
    res.status(500).send('Failed to create hosted zone');
  }
});


// Route to fetch records for a particular hosted zone
router.get('/:hostedZoneId/records', async (req, res) => {
    const { hostedZoneId } = req.params;
    try {
        const records = await fetchRecordsForHostedZone(hostedZoneId);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

router.post('/:hostedZoneId/records', async (req, res) => {
    const { hostedZoneId } = req.params;
    const { recordName, recordType, recordValue, ttl } = req.body;
    try {
        const createdRecord = await createRecord(hostedZoneId, recordName, recordType, recordValue, ttl);
        res.json(createdRecord);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create record' });
    }
});
module.exports = router;
