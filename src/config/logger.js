import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as dotenv from 'dotenv';
dotenv.config();

const logDir = './logs';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV;
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YY-MM-DD HH:MM:SS' }),
  winston.format.printf((info) => `${info.timestamp} | [${info.level}] : ${info.message}`),
);

// const winstonConsole =
//   process.env.NODE_ENV === 'development'
//     ? [
//         new winston.transports.Console({
//           handleExceptions: true,
//         }),
//       ]
//     : [];

const winstonConsole = [
  new winston.transports.Console({
    handleExceptions: true,
  }),
];

const logger = winston.createLogger({
  format,
  level: level(),
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      zippedArchive: true,
      handleExceptions: true,
      maxFiles: 100,
      maxsize: 5242880,
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',
      filename: `%DATE%.error.log`,
      zippedArchive: true,
      maxFiles: 100,
      maxsize: 5242880,
    }),
    new winston.transports.DailyRotateFile({
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/warn',
      filename: `%DATE%.warn.log`,
      zippedArchive: true,
      maxFiles: 100,
      maxsize: 5242880,
    }),
    ...winstonConsole,
  ],
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

export { logger };
