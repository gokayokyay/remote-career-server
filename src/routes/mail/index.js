const logger = require('pino')();
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
 
const auth = {
  auth: {
    api_key: process.env.MAIL_GUN_API,
    domain: process.env.MAIL_GUN_DOMAIN,
  },
};

const transport = nodemailer.createTransport(mg(auth));

module.exports = app => {
  app.post('/mail', async (req, res) => {
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    const {
      name,
      email,
      subject = '',
      message,
    } = req.body;
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('message')) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      return;
    }
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_RECIPIENT,
      subject: `${subject}`,
      text: `${message}`,
    };
    try {
      const info = await transport.sendMail(mailOptions);
      res.send(info);
    } catch(err) {
      logger.error(err);
      res.send(err);
    }
  });
};
