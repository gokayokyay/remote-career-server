const restana = require('restana');
const app = restana();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const logger = require('pino')();
const middlewares = require('./middlewares');

app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(require('cors')());
app.use(middlewares.log);

const connectDB = require('./database');
const registerRoutes = require('./routes');
const s3 = require('./s3');

module.exports.start = async () => {
  logger.info(`Server is starting on port: ${process.env.PORT}`);
  try {
    await connectDB();
    logger.info('Connected to DB!');

    registerRoutes(app);

    await app.start(process.env.PORT, '0.0.0.0');
    logger.info(`Server is started on port: ${process.env.PORT}`);
  } catch (err) {
    logger.error(err);
  }
};