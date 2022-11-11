import { cleanEnv, str, url, port, num } from 'envalid';

const envValidator = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production'] }),
    MONGODB_URL: url(),
    PORT: port(),
    JWT_SECRET_KEY: str(),
    JWT_ISSUER: str(),
    JWT_ACCESS_EXPIRESIN: str(),
    SHIPPING_COST: num(),
    HASH_SALT: num(),
  });
};

export { envValidator };
