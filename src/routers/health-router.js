import { Router } from 'express';
import { loginRequired, isAdmin } from '../middlewares';

const healthRouter = Router();

// health check router
// should be removed when deploy
healthRouter.get('/', (req, res) => {
  res.status(200).json({ message: '누구나 실행할 수 있는 컨트롤러에 도달' });
});

healthRouter.get('/login', loginRequired, (req, res) => {
  res.status(200).json({ message: '로그인 된 사용자만 실행할 수 있는 컨트롤러에 도달' });
});

healthRouter.get('/login-admin', loginRequired, isAdmin, (req, res) => {
  res.status(200).json({ status: '로그인 + 관리자만 실행할 수 있는 컨트롤러에 도달' });
});

export { healthRouter };
