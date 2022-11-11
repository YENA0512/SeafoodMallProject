import { validationResult } from 'express-validator';
import { logger } from '../../config/logger';

const validationErrorChecker = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors);
    return res.status(400).json({ result: 'error', reason: errors.errors });
  }
  next();
};

export { validationErrorChecker };
