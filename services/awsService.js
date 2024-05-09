// services/awsService.js
const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


const route53 = new AWS.Route53();


async function listHostedZones() {
    const params = {};
    let hostedZones = [];
    let data;
    do {
        data = await route53.listHostedZones(params).promise();
        hostedZones = hostedZones.concat(data.HostedZones);
        params.Marker = data.NextMarker;
    } while (data.IsTruncated);

    return hostedZones;
}

async function createHostedZone(domainName, callerReference, comment = '', isPrivateZone = false, vpcId = null, vpcRegion = null) {
    const params = {
        Name: domainName,
        CallerReference: callerReference,
        HostedZoneConfig: {
            Comment: comment,
            PrivateZone: isPrivateZone
        }
    };

    if (isPrivateZone && vpcId && vpcRegion) {
        params.VPC = {
            VPCRegion: vpcRegion,
            VPCId: vpcId
        };
    }

    try {
        const data = await route53.createHostedZone(params).promise();
        return data.HostedZone;
    } catch (error) {
        console.error('Failed to create hosted zone:', error);
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

module.exports = { listHostedZones, createHostedZone , fetchRecordsForHostedZone,createRecord };
