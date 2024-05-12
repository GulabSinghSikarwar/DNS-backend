// routes/hostedZones.js
const express = require('express');
const router = express.Router();
const { listHostedZones, createHostedZone, deleteHostedZone } = require('../controllers/aws/hostedZones');
const { createRecord, fetchRecordsForHostedZone, updateRecord, deleteRecords } = require('../controllers/aws/hostedZoneRecords');

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
    console.log(" body : ", req.body);
    const { domainName, callerReference, comment, isPrivateZone, vpcId, vpcRegion } = req.body;
    try {
        const hostedZone = await createHostedZone(domainName, callerReference, comment, isPrivateZone, vpcId, vpcRegion);
        res.status(201).json(hostedZone);
    } catch (error) {
        console.error('Error creating hosted zone:', error);
        res.status(500).send('Failed to create hosted zone');
    }
});

router.delete('/', async (req, res) => {
    const { id } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ message: "Hosted zone ID is required." });
        }

        const data = await deleteHostedZone(id);
        res.json({ message: "Hosted zone deleted successfully.", data });
    } catch (error) {
        console.error('Error deleting hosted zone:', error);
        res.status(500).json({ message: "Failed to delete hosted zone.", error });
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
    console.log(" requ : ", hostedZoneId);
    const records = req.body;
    console.log(" body : ", records);
    try {
        const createdRecords = await createRecord(hostedZoneId, records);
        res.json(createdRecords);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create records' });
    }
});


// UPDATE RECODS 
router.put('/:hostedZoneId/records/', async (req, res) => {
    const { hostedZoneId } = req.params;
    const { Name, Type, ResourceRecords, TTL } = req.body[0];
    const message = `
    ${Name}, 
    ${TTL},
    ${Type},
    ${ResourceRecords}
    `
    console.log(" message : ",message);
    console.log(" BODY : ", req.body[0]);
    try {
        const updatedRecord = await updateRecord(hostedZoneId, Name,Type, ResourceRecords, TTL);
        res.json(updatedRecord);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update record' });
    }
});

// Deleting Records     
router.delete('/:hostedZoneId/records', async (req, res) => {
    const { hostedZoneId } = req.params;
    const records  = req.body; // Assuming records is an array of objects containing name and type

    console.log("  records : ",JSON.stringify(records));
    try {
        const deletedRecords = await deleteRecords(hostedZoneId, records);
        res.json(deletedRecords);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete records' });
    }
});
module.exports = router;
