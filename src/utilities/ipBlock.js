const crypto = require('crypto');

module.exports = (redis, ip, id = '') => {
  return new Promise((resolve, reject) => {
    let keyId = id;
    if (id === '') {
      // keyId = crypto.randomBytes(8).toString('hex');
      keyId = ip;
    }
    redis.set(`${process.env.IP_BLOCK_KEY}:${keyId}`, ip, 'EX', 86400)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
}