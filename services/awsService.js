const AWS = require('aws-sdk');
let route53;
const getAwsRoute53 = () => {
    if (route53){
        return route53;
}
    // Configure AWS
    AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    route53 = new AWS.Route53();
    return route53
}




module.exports = getAwsRoute53;
