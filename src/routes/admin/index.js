const logger = require('pino')();

const { isBlocked } = require('../../middlewares');
const { redis } = require('../../database');
const { checkAndBlock } = require ('../../utilities');

module.exports = (app) => {
  app.post('/admin/checkkey', isBlocked, async (req, res) => {
    // IP BAN LATER
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('key')) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      await checkAndBlock(redis, req);
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
      await checkAndBlock(redis, req);
    }
  });
}