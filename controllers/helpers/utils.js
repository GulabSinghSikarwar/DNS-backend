
const route53 = require('../../services/awsService')();

// Function to process the records from the uploaded file
const processRecords = async (filePath) => {
  return require(filePath);
};

// Function to push records to Route 53
const uploadFile = async (records) => {
  for (const record of records) {
    await pushRecordToRoute53(record);
  }
};

// Function to push a single record to Route 53
const pushRecordToRoute53 = async (record) => {
  const params = {
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: record.Name,
            Type: record.Type,
            TTL: record.TTL,
            ResourceRecords: record.ResourceRecords
          }
        }
      ]
    },
    HostedZoneId: 'YOUR_HOSTED_ZONE_ID' // Replace with your Hosted Zone ID
  };

  return new Promise((resolve, reject) => {
    route53.changeResourceRecordSets(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports = { uploadFile, processRecords };
