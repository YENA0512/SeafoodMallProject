import mongoose from 'mongoose';
import { logger } from '../config/logger';

const connectMongoDB = async () => {
  const DB_URL = process.env.MONGODB_URL;

  mongoose.connect(DB_URL);
  const db = mongoose.connection;

  db.on('connected', () => logger.info('정상적으로 MongoDB 서버에 연결되었습니다.  '));
  db.on('error', (error) => console.error('\nMongoDB 연결에 실패하였습니다...\n' + '\n' + error));
};

export * from './models/user-model';
export * from './models/category-model';
export * from './models/order-model';
export * from './models/cart-model';
export * from './models/product-model';
export { connectMongoDB };
