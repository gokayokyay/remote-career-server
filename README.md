![remote career logo](https://remotecareer.org/logo.png)
# Remote Career Server

This repository contains [Remote Career](https://remotecareer.org/)'s backend app. 
You can find the frontend of app [here.](https://github.com/gokayokyay/remote-career-client)

### Project Stack
 - [Restana](https://github.com/jkyberneees/ana)
 - [Redis](https://redis.io/)
 - [Nodemailer](https://nodemailer.com/about/) with [Mailgun](https://www.mailgun.com/)
 - [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
 - [IBM Cloud Object Storage](https://www.ibm.com/cloud/object-storage) as file service.
 - [Pino](https://github.com/pinojs/pino) as logger.

### Getting Started
To get started first clone the project.

```bash
git clone https://github.com/gokayokyay/remote-career-server
cd remote-career-server
```
Then create .env file and fill the variables:
```bash
PORT=
MONGODB_URL=
S3=

MAIL_GUN_API=
MAIL_GUN_DOMAIN=
MAIL_RECIPIENT=
INFO_MAIL_ADDRESS=

ADMIN_KEY=
# For free heroku dynos to keep awake
APP_URL=

REDIS_URL=
IP_BLOCK_KEY=ip:blocked
REQUEST_COUNT_KEY=ip
BLOCK_TRESHOLD=5
```
This project uses IBM Cloud Object Storage. S3 variable should contain these values as JSON:
```json
{
"bucketName":  "bucketname",
"serviceCredential":  {},
"endpoint":  "tempendpoint"
}
```
bucketName - Bucket Name

serviceCredential - This value is an object and can be obtained from IBM COS Dashboard

endpoint - Public IBM S3 Endpoint for your region


#### Alternative to S3 environment variable

As an alternative to S3 .env variable, you can create a file named s3.json in root of this project. The variables should be the same as shown above.

#### Development
```bash
# Inside project directory
npm install
# Or if you use yarn
yarn
```

Then you can start the app with:
```bash
npm run dev
# Or if using yarn
yarn dev
```

## Contributing
All contributions are welcome 😍.
