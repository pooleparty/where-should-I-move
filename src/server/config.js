require('dotenv').config();

const environments = {
  DEV: 'dev',
  QA: 'qa',
  PPD: 'ppd',
  PROD: 'prod',
};
const isDeployed = () =>
  process.env.NODE_ENV === environments.DEV ||
  process.env.NODE_ENV === environments.QA ||
  process.env.NODE_ENV === environments.PPD ||
  process.env.NODE_ENV === environments.PROD;

const isProduction = () => process.env.NODE_ENV === environments.PROD;
const getLoggingLevel = () => (process.env.LOGGING_LEVEL || isDeployed() ? 'info' : 'debug');

const config = {
  app_name: 'Node Web App Starter',
  env: {
    isProduction: () => isProduction(),
    isDeployed: () => isDeployed(),
    isDevelopment: () => process.env.NODE_ENV === environments.DEV,
  },
  logging: {
    level: getLoggingLevel(),
  },
  port: process.env.PORT || 3001,
};

export default config;
export { environments, getLoggingLevel }; // for unit testing only
