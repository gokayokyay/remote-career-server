const mongoose = require('mongoose');

module.exports = () => {
  return new Promise((resolve, reject) => {
    mongoose.set('useFindAndModify', false);
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(db => resolve(db))
      .catch(err => reject(err));
  });
};
