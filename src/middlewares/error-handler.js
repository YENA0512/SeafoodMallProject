import { logger } from '../config/logger';

function errorHandler(error, req, res, next) {
  logger.error(error);

  res.status(400).json({ result: 'error', reason: error.message });
}

export { errorHandler };
