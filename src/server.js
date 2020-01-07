const restana = require('restana');
const app = restana();
const bodyParser = require('body-parser');
const logger = require('pino')();

app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

const connectDB = require('./database');
const registerRoutes = require('./routes');

module.exports.start = async () => {
  logger.info(`Server is starting on port: ${process.env.PORT}`);
  try {
    await connectDB();
    logger.info('Connected to DB!');

    registerRoutes(app);

    await app.start(process.env.PORT);
    logger.info(`Server is started on port: ${process.env.PORT}`);
  } catch (err) {
    logger.error(err);
  }
};