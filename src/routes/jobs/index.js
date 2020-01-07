const logger = require('pino')();
const { InReviewJobs, Jobs } = require('../../models');

module.exports = (app) => {
  app.get('/jobs', async (req, res) => {
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    const fullJobs = await Jobs.find({});
    console.log(fullJobs);
    const documents = fullJobs.map(({_doc}) => _doc);
    const jobs = documents.map(({key, ...properties}) => properties);
    console.log(jobs);
    res.send(jobs);
  });
  app.get('/reviewJobs', async (req, res) => {
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    const fullReviewJobs = await InReviewJobs.find();
    const documents = fullReviewJobs.map(({_doc}) => _doc);
    const jobs = documents.map(({key, ...properties}) => properties);
    res.send(jobs);
  });
  app.post('/jobs', async (req, res) => {
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    // console.log(req.body);
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
  app.get('/jobs/:jobId', async (req, res) => {
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);

    try {
      const { jobId } = req.params;
      const job = await Jobs.findById(jobId);
      res.send(job);
    } catch (err) {
      logger.error(err);
      console.log(err);
      res.send(err);
    }
  });
  app.post('/jobs/move/:jobId', async (req, res) => {
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    try {
      const { jobId } = req.params;
      const reviewedJob = await InReviewJobs.findById(jobId).lean();
      // console.log(reviewedJob);
      const { _id, key, createdAt, updatedAt, _v, ...idlessJob } = reviewedJob;
      console.log(idlessJob);
      const job = new Jobs(idlessJob);
      await job.save();
      res.send(job);
    } catch (err) {
      logger.error(err);
      console.log(err);
      res.send(err);
    }
  });
  app.options('/jobs', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.send(200);
  });
}
