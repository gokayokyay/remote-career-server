const logger = require('pino')();

module.exports = (req, res, next) => {
  logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
  next();
}