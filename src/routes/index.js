module.exports = app => {
  require('./jobs')(app);
  require('./files')(app);
};