import jwt from 'jsonwebtoken';
import { Role } from '../models/types';

export const JWT_SECRET = process.env.JWT_SECRET || 'staffsync_mentor_review_secret_key_2026';
export const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
  department: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
};
