const route53 = require('../../services/awsService')()
const { uploadFile, processRecords } = require('../helpers/utils')

async function fetchRecordsForHostedZone(hostedZoneId) {
    try {
        const params = {
            HostedZoneId: hostedZoneId
        };

        const data = await route53.listResourceRecordSets(params).promise();
        return data.ResourceRecordSets;
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
}


async function createRecord(hostedZoneId, records) {
    
    // console.log("zone id  : ",records);
    
    const changes = records.map(record => ({
        Action: "CREATE",
        ResourceRecordSet: {
            Name: record.Name,
            Type: record.Type,
            TTL: record.TTL || 300,
            ResourceRecords: [...record.ResourceRecords]
        }
    }));
    

    const params = {
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
            Changes: changes
        }
    };

    try {
        console.log("params : .......................",JSON.stringify(params));
        const data = await route53.changeResourceRecordSets(params).promise();
        return data;
    } catch (error) {
        console.error('Error creating records:', error);
        throw error;
    }
}



async function updateRecord(hostedZoneId, recordName, recordType, newRecordValue, ttl = 300) {
    const params = {
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
            Changes: [{
                Action: "UPSERT", // UPSERT will create the record if it doesn't exist or update it if it does
                ResourceRecordSet: {
                    Name: recordName,
                    Type: recordType,
                    TTL: ttl,
                    ResourceRecords:newRecordValue
                }
            }]
        }
    };

    try {
        const data = await route53.changeResourceRecordSets(params).promise();
        return data;
    } catch (error) {
        console.error('Error updating record:', error);
        throw error;
    }
}


async function deleteRecords(hostedZoneId, records) {
    const changes = records.map(record => ({
        Action: "DELETE",
        ResourceRecordSet: {
            Name: record.Name,
            Type: record.Type,
            TTL: record.TTL || 3600, // Use the provided TTL value or default to 3600
            ResourceRecords: record.ResourceRecords || [{ Value: "placeholder" }] // Use the provided ResourceRecords or default to placeholder
        }
    }));

    const params = {
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
            Changes: changes
        }
    };

    try {
        const data = await route53.changeResourceRecordSets(params).promise();
        return data;
    } catch (error) {
        console.error('Error deleting records:', error);
        throw error;
    }
}

async function bulkUpload(req, resp) {
    try {
        const file = req.file;
        const records = await processRecords(file.path);
        await uploadFile(records);
        res.send('File uploaded and data pushed to Route 53');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}






module.exports = { createRecord, fetchRecordsForHostedZone, updateRecord, deleteRecords, bulkUpload }