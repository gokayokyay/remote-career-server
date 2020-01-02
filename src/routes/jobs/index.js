const logger = require('pino')();
const { InReviewJobs, Jobs } = require('../../models');

module.exports = (app) => {
  app.get('/jobs', async (req, res) => {
    const fullJobs = await Jobs.find({});
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
      let job = new InReviewJobs({
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
  app.get('/jobs/:postId', async (req, res) => {
    try {
      const { postId } = req.params;
      const job = await Jobs.findById(postId);
      res.send(job);
    } catch (err) {
      logger.error(err);
      console.log(err);
      res.send(err);
    }
  });
}
