const logger = require('pino')();
const transport = require('../../mail');

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
