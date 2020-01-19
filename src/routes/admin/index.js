const logger = require('pino')();

module.exports = (app) => {
  app.post('/admin/checkkey', (req, res) => {
    // IP BAN LATER
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('key')) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      return;
    }
    const { key } = req.body;
    if (process.env.ADMIN_KEY === key) {
      res.send({
        code: 200,
        message: {
          key,
        },
      }, 200, {
        'Set-Cookie': `x-admin-key=${key}; Domain=.localhost.org`,
      });
    } else {
      res.send({
        code: 403,
        message: 'Invalid key.',
      }, 403);
    }
  });
}