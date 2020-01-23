const logger = require('pino')();
const { InReviewJobs, Jobs } = require('../../models');
const { isBlocked } = require('../../middlewares');
const { checkAndBlock, approvalMailTemplate } = require ('../../utilities');
const { redis } = require('../../database');
const transport = require('../../mail');

module.exports = (app) => {
  app.get('/jobs', isBlocked, async (req, res) => {
    const fullJobs = await Jobs.find({});
    const documents = fullJobs.map(({_doc}) => _doc);
    const jobs = documents.map(({key, contactEmail, ...properties}) => properties);
    res.send(jobs);
  });
  app.get('/reviewJobs', isBlocked, async (req, res) => {
    // IP BAN LATER
    if (!req.headers.hasOwnProperty('x-admin-key') && req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      await checkAndBlock(redis, req);
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
  app.post('/jobs', isBlocked, async (req, res) => {
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
      const mailOptions = {
        from: `"Remote Career" <${process.env.MAIL_RECIPIENT}>`,
        to: process.env.MAIL_RECIPIENT,
        subject: `New Job Posted!`,
        text: `Hello sir. A new job has been posted by ${companyName}. Please check it.`,
      };
      await transport.sendMail(mailOptions);
      res.send(job);
    } catch (err) {
      logger.error(err);
      res.send(err);
    }
  });
  app.put('/jobs', isBlocked, async (req, res) => {
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
        await checkAndBlock(redis, req);
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
  app.post('/reviewjobs/confirm/:jobId', isBlocked, async (req, res) => {
    // IP BAN LATER
    if (!req.headers.hasOwnProperty('x-admin-key') && req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      await checkAndBlock(redis, req);
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
      await transport.sendMail(approvalMailTemplate(job.contactEmail, job.position, job.key, job.id));
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
  app.post('/reviewjobs/decline/:jobId', isBlocked, async (req, res) => {
    // IP BAN LATER
    if (!req.headers.hasOwnProperty('x-admin-key') && req.headers['x-admin-key'] !== process.env.ADMIN_KEY) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      await checkAndBlock(redis, req);
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
  app.post('/jobs/checkkey', isBlocked, async (req, res) => {
    // IP BAN LATER
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('key') || !req.body.hasOwnProperty('jobId')) {
      res.send({
        code: 400,
        message: 'Missing information.',
      }, 400);
      await checkAndBlock(redis, req);
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
        await checkAndBlock(redis, req);
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
