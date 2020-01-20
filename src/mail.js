const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
 
const auth = {
  auth: {
    api_key: process.env.MAIL_GUN_API,
    domain: process.env.MAIL_GUN_DOMAIN,
  },
  host: 'api.eu.mailgun.net',
};

const transport = nodemailer.createTransport(mg(auth));

module.exports = transport;