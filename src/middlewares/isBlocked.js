const logger = require('pino')();
const { redis } = require('../database');

module.exports = (req, res, next) => {
  redis.keys(`${process.env.IP_BLOCK_KEY}:*`).then(keys => {
    keys.forEach(key => {
      redis.get(key).then((val, index) => {
        if (req.socket.localAddress === val) {
          logger.info(`${val} tried to reach ${req.originalUrl}, but it is blocked.`);
          next('IP is blocked for one day.', 403);
          res.send(403);
        }
      }).catch(err => {
        // console.log(err);
        res.send({
          code: 500,
          message: err,
        }, 500);
      });
    });
  }).catch(err => {
    res.send({
      code: 500,
      message: err,
    }, 500);
  });
  next();
}