import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from './env.js';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'patient' | 'provider' | 'clinic_admin' | 'super_admin';
  tenantId?: string;
}

export interface RefreshTokenPayload {
  id: string;
  tokenVersion: number;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  } as SignOptions);
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  } as SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export function generateTokenPair(
  accessPayload: TokenPayload,
  refreshPayload: RefreshTokenPayload
): { accessToken: string; refreshToken: string } {
  return {
    accessToken: generateAccessToken(accessPayload),
    refreshToken: generateRefreshToken(refreshPayload),
  };
}
