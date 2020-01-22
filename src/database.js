const mongoose = require('mongoose');
const IORedis = require("ioredis");
const redis = new IORedis(process.env.REDIS_URL);

module.exports = () => {
  return new Promise((resolve, reject) => {
    // mongoose.set('useFindAndModify', false);
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(db => resolve(db))
      .catch(err => reject(err));
  });
};
// redis.set(123,123,'ex', 86400, 2)
module.exports.redis = redis;