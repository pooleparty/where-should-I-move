/* eslint-disable no-process-exit */
import { hostname } from 'os';
import logger from './utils/logger';
import config from './config';
import app from './app';

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
