import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret:
    process.env.JWT_ACCESS_SECRET || 'dev_access_secret_key_32chars_min',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key_32chars_min',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
