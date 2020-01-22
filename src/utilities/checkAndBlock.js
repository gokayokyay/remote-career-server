const incRequest = require('./incRequest');
const ipBlock = require('./ipBlock');

module.exports = async (redis, req) => {
  try {
    const count = await incRequest(redis, req.socket.localAddress);
    console.log(count);
    if (count >= process.env.BLOCK_TRESHOLD) {
      await ipBlock(redis, req.socket.localAddress);
      return true;
    }
    return false;
  } catch (err) {
    throw err;
  }
}