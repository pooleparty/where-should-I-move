import winston from 'winston';
import correlator from 'express-correlation-id';
import config from '../config';

const addCorrelationId = (level, msg, meta) =>
  Object.assign({}, meta, { correlationId: correlator.getId() });

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      json: config.env.isDeployed(),
      stringify: config.env.isDeployed(),
      timestamp: true,
      colorize: config.env.isDeployed() ? false : 'all',
      level: config.logging.level,
    }),
  ],
  rewriters: config.env.isDeployed() ? [addCorrelationId] : undefined,
});

export default logger;
