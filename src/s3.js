const IBMCOS = require('ibm-cos-sdk');
const fs = require('fs');

const bucketConfig = JSON.parse(process.env.S3) || require('../s3.json');

const config = {
  useHmac: false,
  bucketName: bucketConfig.bucketName,
  serviceCredential: bucketConfig.serviceCredential,
};

const defaultEndpoint = 's3.us.cloud-object-storage.appdomain.cloud';

const s3 = new IBMCOS.S3({
  apiKeyId: config.serviceCredential.apikey,
  serviceInstanceId: config.serviceCredential.resource_instance_id,
  region: 'ibm',
  endpoint: new IBMCOS.Endpoint(bucketConfig.endpoint),
});

module.exports.uploadFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        s3.upload({
          Bucket: config.bucketName,
          Key: path,
          Body: data,
        }, (s3err, s3data) => {
          if (s3err) {
            reject(s3err);
          } else {
            resolve(s3data);
          }
        });
      }
    });
  });
};