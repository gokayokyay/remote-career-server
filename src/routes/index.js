module.exports = app => {
  require('./jobs')(app);
  require('./upload')(app);
  require('./mail')(app);
  require('./admin')(app);
};