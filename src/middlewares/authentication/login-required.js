import jwt from 'jsonwebtoken';
import { logger } from '../../config/logger';

const loginRequired = (req, res, next) => {
  const userToken = req.headers.authorization?.split(' ')[1];

  if (!userToken || userToken === 'null') {
    logger.warn('서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음');
    res.status(401).json({
      result: 'un-authorized',
      reason: '로그인한 유저만 사용할 수 있는 서비스입니다.',
    });

    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    const jwtDecoded = jwt.verify(userToken, secretKey);

    const userId = jwtDecoded.userId;
    const userRole = jwtDecoded.role;

    req.currentUserId = userId;
    req.currentUserRole = userRole;

    next();
  } catch (error) {
    res.status(401).json({
      result: 'un-authorized',
      reason: '정상적인 토큰이 아닙니다.',
    });
  }
};

export { loginRequired };
