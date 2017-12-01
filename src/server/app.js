import path from 'path';
import express from 'express';
import correlator from 'express-correlation-id';
// import favicon from 'serve-favicon';
import expressWinston from 'express-winston';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import httpStatus from 'http-status';
import config from './config';
import logger from './utils/logger';
import index from './controllers';

const app = express();
app.disable('x-powered-by');
app.set('json spaces', 2);

// View engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.get('/health', (req, res) => {
  res.status(httpStatus.OK);
  res.send(`${config.app_name} is healthy.`);
});
// app.use(favicon(path.join(process.cwd(), '/public/favicon.ico')));

app.use(correlator());

const winstonOptions = {
  winstonInstance: logger,
  statusLevels: true,
  colorize: !config.env.isDeployed(),
};

if (config.env.isDevelopment) {
  winstonOptions.requestWhitelist = ['url', 'method', 'originalUrl', 'query'];
}

if (config.env.isDeployed()) {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger(winstonOptions));
}

app.use(express.static(path.join(process.cwd(), '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);

// catch 404 and forward to error handler
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  logger.warn(`No route found for: ${req.path}`);
  res.status(httpStatus.NOT_FOUND);
  res.render('notFound', { title: config.app_name });
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(`Rendering error: ${JSON.stringify(err)}`);
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = config.env.isProduction() ? {} : err;

  // render the error page
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.render('error', {
    title: config.app_name,
    message: err.message,
    error: config.env.isProduction() ? {} : err,
    status: err.status,
    correlationId: req.correlationId ? req.correlationId() : null,
  });
});

export default app;
