import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { viewsRouter, v1Router } from './routers';
import { errorHandler } from './middlewares';
import { envValidator } from './middlewares/validation/envValidator';
import { connectMongoDB } from './db';
import morgan from 'morgan';
import * as helmet from 'helmet';
import { logger } from './config/logger';

class Server {
  constructor() {
    const app = express();
    this.app = app;
    this.isProd = process.env.NODE_ENV === 'production';
  }

  connectDB() {
    connectMongoDB();
  }

  setMiddleware() {
    dotenv.config({
      path: path.resolve(process.env.NODE_ENV === 'production' ? '.production.env' : '.env'),
    });
    envValidator();

    if (this.isProd) {
      this.app.use(morgan('combined'));
      this.app.use(helmet);
    } else {
      this.app.use(morgan('dev'));
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
    logger.info('서버 시작');
  }
}

const server = new Server();

export { server };
