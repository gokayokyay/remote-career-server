module.exports = app => {
  require('./jobs')(app);
  require('./upload')(app);
};