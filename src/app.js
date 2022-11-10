import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { viewsRouter, v1Router } from './routers';
import { errorHandler } from './middlewares';
import { envValidator } from './middlewares/validation/envValidator';
import { connectMongoDB } from './db';

class Server {
  constructor() {
    const app = express();
    this.app = app;
    this.port = process.env.PORT;
    this.env = process.env.NODE_ENV;
  }

  connectDB() {
    connectMongoDB();
  }

  setMiddleware() {
    dotenv.config({
      path: path.resolve(this.env === 'production' ? '.production.env' : '.env'),
    });
    envValidator();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoute() {
    this.app.use(viewsRouter);
    this.app.use('/api/v1', v1Router);
  }

  setErrorHandler() {
    this.app.use(errorHandler);
  }

  init() {
    this.setMiddleware();
    this.connectDB();
    this.setRoute();
    this.setErrorHandler();
  }

  start() {
    this.init();
    this.app.listen(this.port, () => {
      console.log(`정상적으로 서버를 시작하였습니다.  http://localhost:${this.port}`);
    });
  }
}

const server = new Server();

export { server };

// const app = express();

// // CORS 에러 방지
// app.use(cors());

// // Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
// app.use(express.json());

// // Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
// app.use(express.urlencoded({ extended: false }));

// // html, css, js 라우팅
// app.use(viewsRouter);

// // api 라우팅
// // 아래처럼 하면, userRouter 에서 '/login' 으로 만든 것이 실제로는 앞에 /api가 붙어서
// // /api/login 으로 요청을 해야 하게 됨. 백엔드용 라우팅을 구분하기 위함임.
// // app.use('/api', userRouter);
// app.use('/api/v1', v1Router);

// // 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// // 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
// app.use(errorHandler);

// export { app };
