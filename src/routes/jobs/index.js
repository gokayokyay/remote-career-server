const logger = require('pino')();
const { InReviewJobs, Jobs } = require('../../models');

module.exports = (app) => {
  app.get('/jobs', async (req, res) => {
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    const fullJobs = await Jobs.find({});
    const documents = fullJobs.map(({_doc}) => _doc);
    const jobs = documents.map(({key, contactEmail, ...properties}) => properties);
    res.send(jobs);
  });
  app.get('/reviewJobs', async (req, res) => {
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    // IP BAN LATER
    if (!req.headers.hasOwnProperty('x-admin-key') && req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      return;
    }
    const fullReviewJobs = await InReviewJobs.find();
    const documents = fullReviewJobs.map(({_doc}) => _doc);
    const jobs = documents.map(({key, ...properties}) => properties);
    res.send({
      code: 200,
      message: jobs,
    });
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
        niceToHave,
        responsibilities,
        applyLink,
        contactEmail,
      } = body;
      console.log(body);
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
        niceToHave,
        responsibilities,
        contactEmail,
      });
      await job.save();
      res.send(job);
    } catch (err) {
      logger.error(err);
      res.send(err);
    }
  });
  app.put('/jobs', async (req, res) => {
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
        niceToHave,
        responsibilities,
        applyLink,
        id,
        key,
      } = body;
      console.log(body);
      let exJob = await Jobs.findById(id).lean();
      if (exJob.key !== key) {
        res.send({
          code: 403,
          message: 'Keys mismatch',
        }, 403);
        return;
      }
      let newJob = await Jobs.findByIdAndUpdate({ _id: id }, {
        position,
        companyName,
        companyHeadquarters,
        companyLogo,
        locationRestriction,
        tags,
        description,
        requirements,
        applyLink,
        niceToHave,
        responsibilities,
      }, { new: true });
      res.send(newJob);
    } catch (err) {
      logger.error(err);
      res.send(err);
    }
  });
  app.get('/jobs/:jobId', async (req, res) => {
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);

    try {
      const { jobId } = req.params;
      const job = await Jobs.findById(jobId).lean();
      const { key, contactEmail, ...noKeyJob } = job; 
      res.send(noKeyJob);
    } catch (err) {
      logger.error(err);
      console.log(err);
      res.send(err);
    }
  });
  app.post('/reviewjobs/confirm/:jobId', async (req, res) => {
    // IP BAN LATER
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    if (!req.headers.hasOwnProperty('x-admin-key') && req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      return;
    }
    try {
      const { jobId } = req.params;
      const reviewedJob = await InReviewJobs.findById(jobId).lean();
      // console.log(reviewedJob);
      const { _id, key, createdAt, updatedAt, _v, ...idlessJob } = reviewedJob;
      const job = new Jobs(idlessJob);
      await job.save();
      await InReviewJobs.findByIdAndRemove(_id);
      // TODO MAIL
      res.send({
        code: 200,
        message: job.id,
      });
    } catch (err) {
      logger.error(err);
      console.log(err);
      res.send(err);
    }
  });
  app.post('/reviewjobs/decline/:jobId', async (req, res) => {
    // IP BAN LATER
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    if (!req.headers.hasOwnProperty('x-admin-key') && req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      return;
    }
    // TODO
    // try {
    //   const { jobId } = req.params;
    //   const reviewedJob = await InReviewJobs.findById(jobId).lean();
    //   // console.log(reviewedJob);
    //   const { _id, key, createdAt, updatedAt, _v, ...idlessJob } = reviewedJob;
    //   console.log(idlessJob);
    //   const job = new Jobs(idlessJob);
    //   await job.save();
    //   res.send(job);
    // } catch (err) {
    //   logger.error(err);
    //   console.log(err);
    //   res.send(err);
    // }
  });
  app.post('/jobs/checkkey', async (req, res) => {
    // IP BAN LATER
    logger.info(`${req.method} request at ${req.originalUrl} from ${req.socket.localAddress}`);
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('key') || !req.body.hasOwnProperty('jobId')) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      return;
    }
    try {
      const { jobId, key } = req.body;
      const job = await Jobs.findById(jobId).lean();
      if (job.key !== key) {
        res.send({
          code: 403,
          message: 'Keys mismatch',
        }, 403);
        return;
      }
      res.send({
        code: 200,
        message: {
          key,
        },
      }, 200);
    } catch (err) {
      logger.error(err);
      res.send(err);
    }
  });
}
