import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { viewsRouter, v1Router } from './routers';
import { errorHandler } from './middlewares';
import { envValidator } from './middlewares/validation/envValidator';
import { connectMongoDB } from './db';
import morgan from 'morgan';
import { logger } from './config/logger';

class Server {
  constructor() {
    const app = express();
    this.app = app;
  }

  connectDB() {
    connectMongoDB();
  }

  setMiddleware() {
    dotenv.config({
      path: path.resolve(process.env.NODE_ENV === 'production' ? '.production.env' : '.env'),
    });
    envValidator();

    if (process.env.NODE_ENV === 'production') {
      this.app.use(morgan('combined', { stream: logger.stream }));
    } else {
      this.app.use(morgan('dev', { stream: logger.stream }));
    }

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
    this.app.listen(process.env.PORT, () => {
      logger.info(`정상적으로 서버를 시작하였습니다.  http://localhost:${process.env.PORT}`);
    });
  }
}

const server = new Server();
server.start();

export { server };
