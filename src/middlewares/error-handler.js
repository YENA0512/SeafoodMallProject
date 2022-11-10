import { logger } from '../config/logger';

function errorHandler(error, req, res, next) {
  logger.error(error);

  // 에러는 400 코드의 JSON 형태로 프론트에 전달됨
  res.status(400).json({ result: 'error', reason: error.message });
}

export { errorHandler };
