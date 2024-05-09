const route53 = require('../../services/awsService')()


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


async function createRecord(hostedZoneId, recordName, recordType, recordValue, ttl = 300) {
    const params = {
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
            Changes: [{
                Action: "CREATE",
                ResourceRecordSet: {
                    Name: recordName,
                    Type: recordType,
                    TTL: ttl,
                    ResourceRecords: [{ Value: recordValue }]
                }
            }]
        }
    };

    try {
        const data = await route53.changeResourceRecordSets(params).promise();
        return data;
    } catch (error) {
        console.error('Error creating record:', error);
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
                    ResourceRecords: [{ Value: newRecordValue }]
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
            Name: record.name,
            Type: record.type,
            TTL: record.ttl || 3600, // Use the provided TTL value or default to 3600
            ResourceRecords: record.resourceRecords || [{ Value: "placeholder" }] // Use the provided ResourceRecords or default to placeholder
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








module.exports = { createRecord, fetchRecordsForHostedZone ,updateRecord,deleteRecords }