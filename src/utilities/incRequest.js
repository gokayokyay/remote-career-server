module.exports = (redis, ip) => {
  return new Promise((resolve, reject) => {
    redis.set(`${process.env.REQUEST_COUNT_KEY}:${ip}`, 0, 'EX', 86400, 'NX')
      .then(() => {
        redis.incr(`${process.env.REQUEST_COUNT_KEY}:${ip}`)
          .then(count => {
            resolve(count);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}