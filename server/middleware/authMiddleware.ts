import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../config/jwt';
import { UserModel } from '../config/db';
import { User } from '../models/types';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid format. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please re-authenticate.'
      });
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }

    // Attach user to request object (excluding password)
    const { password, ...safeUser } = user;
    req.user = safeUser as User;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server authentication error.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
