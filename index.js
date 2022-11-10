import * as dotenv from 'dotenv';
import * as path from 'path';

import { app } from './src/app';
import { connectMongoDB } from './src/db';
import { envValidator } from './src/middlewares/validation/envValidator';

dotenv.config({
  path: path.resolve(process.env.NODE_ENV === 'production' ? '.production.env' : '.env'),
});

envValidator();
connectMongoDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`정상적으로 서버를 시작하였습니다.  http://localhost:${PORT}`);
});
