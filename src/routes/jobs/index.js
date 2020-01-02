const logger = require('pino')();
const { InReviewJobs } = require('../../models');

module.exports = (app) => {
  app.get('/jobs', async (req, res) => {
    const fullJobs = await InReviewJobs.find({});
    const documents = fullJobs.map(({_doc}) => _doc);
    const jobs = documents.map(({key, ...properties}) => properties);
    res.send(jobs);
  });
  app.post('/jobs', async (req, res) => {
    try {
      const body = req.body;
      const { 
        position, 
        companyName, 
        companyLogo,
        companyHeadquarters,
        locationRestriction,
        tags,
        description,
        requirements,
        applyLink,
      } = body;
      let job = new Jobs({
        position,
        companyName,
        companyHeadquarters,
        companyLogo,
        locationRestriction,
        tags,
        description,
        requirements,
        applyLink,
      });
      await job.save();
      res.send(job);
    } catch (err) {
      logger.error(err);
      res.send(err);
    }
  });
}
