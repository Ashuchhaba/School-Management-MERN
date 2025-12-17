require('dotenv').config();
const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.MongoDB({
      level: 'info',
      db: process.env.MONGO_URI,
      options: { useUnifiedTopology: true },
      collection: 'logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

module.exports = logger;
