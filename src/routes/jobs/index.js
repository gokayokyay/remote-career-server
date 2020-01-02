const { Jobs } = require('../../models');
module.exports = (app) => {
  app.get('/jobs', async (req, res) => {
    const jobs = await Jobs.find({});
    res.send(jobs);
  });
  app.post('/jobs', (req, res) => {
    console.log(req.body);
  });
}