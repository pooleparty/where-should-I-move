/* eslint-disable no-process-exit */
import express from 'express';
import correlator from 'express-correlation-id';
import path from 'path';
import expressWinston from 'express-winston';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import httpStatus from 'http-status';
// import favicon from 'serve-favicon';
import { hostname } from 'os';
import logger from './utils/logger';
import index from './controllers';
import config from './config';

const app = express();
app.disable('x-powered-by');
app.set('json spaces', 2);

// View engine setup
// app.set('views', path.join(__dirname, '/views'));
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

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const PORT = normalizePort(config.port);
app.set('port', PORT);

const HOSTNAME = hostname();

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const server = app.listen(PORT);

function onListening() {
  logger.info(`Server listening at: http://${HOSTNAME}:${PORT}`);
}

server.on('error', onError);
server.on('listening', onListening);
