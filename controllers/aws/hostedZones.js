const getAwsRoute53= require('../../services/awsService')

// const AWS=require('aws-sdk')

// AWS.config.update({
//     region: process.env.AWS_REGION,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });
// const route53 = new AWS.Route53();
async function listHostedZones() {
    const params = {};
    let hostedZones = [];
    const route53=getAwsRoute53()
    let data;
    do {
        data = await route53.listHostedZones(params).promise();
        hostedZones = hostedZones.concat(data.HostedZones);
        params.Marker = data.NextMarker;
    } while (data.IsTruncated);

    return hostedZones;
}

async function createHostedZone(domainName, callerReference, comment = '', isPrivateZone = false, vpcId = null, vpcRegion = null) {
    const route53=getAwsRoute53()
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

async function deleteHostedZone(hostedZoneId) {
    const route53=getAwsRoute53()
    const params = {
        Id: hostedZoneId
    };

    try {
        const data = await route53.deleteHostedZone(params).promise();
        return data;
    } catch (error) {
        console.error('Error deleting hosted zone:', error);
        throw error;
    }
}


module.exports ={listHostedZones,createHostedZone, deleteHostedZone}