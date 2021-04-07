const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, label, printf } = format;
const env = process.env.ENV || 'LOCAL';

const customLogFormat = printf(info => {
  return JSON.stringify({
    time: info.timestamp,
    env: info.label,
    level: info.level,
    message: info.message
  });
});

const logger = createLogger({
  format: combine(label({ label: env }), timestamp(), customLogFormat),
  transports: [new transports.Console()]
});

module.exports = logger;
