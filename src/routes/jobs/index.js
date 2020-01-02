const logger = require('pino')();
const { Jobs } = require('../../models');

module.exports = (app) => {
  app.get('/jobs', async (req, res) => {
    const jobs = await Jobs.find({});
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

const keyList = [
  'position', 
  'companyName', 
  'companyHeadquarters',
  'locationRestriction',
  'tags',
  'description',
  'requirements',
  'applyLink',
]

function checkKeys(body) {
  const failedKeys = [];
  for (let key of keyList) {
    if (!body.hasOwnProperty(key)) {
      failedKeys.push(key);
    }
  }
  return failedKeys;
}