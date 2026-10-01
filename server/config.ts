import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT) || 3005;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is required in production.');
    }
    return 'development_fallback_jwt_secret_do_not_use_in_prod';
  }
  return secret;
}
