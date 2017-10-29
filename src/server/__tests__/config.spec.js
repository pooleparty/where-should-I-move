import config, { environments, getLoggingLevel } from '../config';

const setEnv = (env) => {
  if (typeof env === 'undefined') {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = env;
  }
};

describe('Config tests', () => {
  describe('Environment tests', () => {
    [
      { env: environments.DEV, result: false },
      { env: environments.QA, result: false },
      { env: environments.PPD, result: false },
      { env: environments.PROD, result: true },
      { env: '', result: false },
      { result: false },
    ].forEach((t) => {
      test(`env.isProduction() should return ${t.result} for '${t.env}'`, () => {
        setEnv(t.env);
        expect(config.env.isProduction()).toEqual(t.result);
      });
    });
    [
      { env: environments.DEV, result: true },
      { env: environments.QA, result: true },
      { env: environments.PPD, result: true },
      { env: environments.PROD, result: true },
      { env: '', result: false },
      { result: false },
    ].forEach((t) => {
      test(`env.isDeployed() should return ${t.result} for '${t.env}'`, () => {
        setEnv(t.env);
        expect(config.env.isDeployed()).toEqual(t.result);
      });
    });
  });
  describe('Logging level tests', () => {
    [
      { env: environments.DEV, result: 'info' },
      { env: environments.QA, result: 'info' },
      { env: environments.PPD, result: 'info' },
      { env: environments.PROD, result: 'info' },
      { env: '', result: process.env.LOGGING_LEVEL || 'debug' },
      { result: process.env.LOGGING_LEVEL || 'debug' },
    ].forEach((t) => {
      test(`logging.level should return ${t.result} for '${t.env}'`, () => {
        setEnv(t.env);
        expect(getLoggingLevel()).toEqual(t.result);
      });
    });
  });
});
